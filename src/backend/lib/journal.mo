import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Types "../types/journal";
import Common "../types/common";

module {
  // Per-principal journal store: principal -> list of entries
  public type JournalStore = Map.Map<Principal, List.List<Types.JournalEntry>>;
  // Per-principal next-entry-id counter
  public type IdCounterStore = Map.Map<Principal, Common.JournalEntryId>;

  // Get (or lazily create) the entry list for a principal
  func getOrCreateList(store : JournalStore, principal : Principal) : List.List<Types.JournalEntry> {
    switch (store.get(principal)) {
      case (?list) list;
      case null {
        let list = List.empty<Types.JournalEntry>();
        store.add(principal, list);
        list;
      };
    };
  };

  // Get next id for a principal and increment
  func nextId(idCounters : IdCounterStore, principal : Principal) : Common.JournalEntryId {
    let current = switch (idCounters.get(principal)) {
      case (?n) n;
      case null 0;
    };
    idCounters.add(principal, current + 1);
    current;
  };

  public func createEntry(
    store      : JournalStore,
    idCounters : IdCounterStore,
    principal  : Principal,
    input      : Types.JournalEntryInput,
    now        : Common.Timestamp,
  ) : Types.JournalEntry {
    let id = nextId(idCounters, principal);
    let entry : Types.JournalEntry = {
      id;
      title      = input.title;
      body       = input.body;
      tags       = input.tags;
      caseRefs   = input.caseRefs;
      theoryRefs = input.theoryRefs;
      createdAt  = now;
      updatedAt  = now;
    };
    let list = getOrCreateList(store, principal);
    list.add(entry);
    entry;
  };

  public func updateEntry(
    store     : JournalStore,
    principal : Principal,
    id        : Common.JournalEntryId,
    input     : Types.JournalEntryInput,
    now       : Common.Timestamp,
  ) : ?Types.JournalEntry {
    switch (store.get(principal)) {
      case null null;
      case (?list) {
        var updated : ?Types.JournalEntry = null;
        list.mapInPlace(func(e) {
          if (e.id == id) {
            let newEntry : Types.JournalEntry = {
              e with
              title      = input.title;
              body       = input.body;
              tags       = input.tags;
              caseRefs   = input.caseRefs;
              theoryRefs = input.theoryRefs;
              updatedAt  = now;
            };
            updated := ?newEntry;
            newEntry;
          } else {
            e;
          };
        });
        updated;
      };
    };
  };

  public func deleteEntry(
    store     : JournalStore,
    principal : Principal,
    id        : Common.JournalEntryId,
  ) : Bool {
    switch (store.get(principal)) {
      case null false;
      case (?list) {
        let before = list.size();
        let kept = list.filter(func(e) { e.id != id });
        list.clear();
        list.append(kept);
        list.size() < before;
      };
    };
  };

  public func listEntries(
    store    : JournalStore,
    principal : Principal,
    page     : Nat,
    pageSize : Nat,
  ) : Types.JournalPage {
    let all = switch (store.get(principal)) {
      case null [];
      case (?list) list.toArray();
    };
    // Sort descending by createdAt (most recent first)
    let sorted = all.sort(func(a : Types.JournalEntry, b : Types.JournalEntry) : { #less; #equal; #greater } {
      if (a.createdAt > b.createdAt) #less
      else if (a.createdAt < b.createdAt) #greater
      else #equal;
    });
    let totalCount = sorted.size();
    let safePageSize = if (pageSize == 0) 10 else pageSize;
    let start = page * safePageSize;
    let entries = if (start >= totalCount) {
      [];
    } else {
      let end = if (start + safePageSize > totalCount) totalCount else start + safePageSize;
      sorted.sliceToArray(start, end);
    };
    { entries; totalCount; page; pageSize = safePageSize };
  };

  public func getEntry(
    store     : JournalStore,
    principal : Principal,
    id        : Common.JournalEntryId,
  ) : ?Types.JournalEntry {
    switch (store.get(principal)) {
      case null null;
      case (?list) list.find(func(e) { e.id == id });
    };
  };

  // Filter by date range and/or tag and/or keyword in title/body
  public func searchEntries(
    store     : JournalStore,
    principal : Principal,
    fromDate  : ?Common.Timestamp,
    toDate    : ?Common.Timestamp,
    tag       : ?Text,
    keyword   : ?Text,
  ) : [Types.JournalEntry] {
    let all = switch (store.get(principal)) {
      case null List.empty<Types.JournalEntry>();
      case (?list) list;
    };
    let lowerKeyword = switch (keyword) {
      case null null;
      case (?kw) ?(kw.toLower());
    };
    all.filter(func(e) {
      let passFrom = switch (fromDate) {
        case null true;
        case (?fd) e.createdAt >= fd;
      };
      let passTo = switch (toDate) {
        case null true;
        case (?td) e.createdAt <= td;
      };
      let passTag = switch (tag) {
        case null true;
        case (?t) e.tags.find(func(tg) { tg == t }) != null;
      };
      let passKeyword = switch (lowerKeyword) {
        case null true;
        case (?kw) {
          e.title.toLower().contains(#text kw) or
          e.body.toLower().contains(#text kw);
        };
      };
      passFrom and passTo and passTag and passKeyword;
    }).toArray();
  };

  // Auto-compute milestone from entry count
  public func getMilestone(entryCount : Nat) : Common.Milestone {
    if (entryCount <= 10) #Associate
    else if (entryCount <= 30) #Bachelor
    else if (entryCount <= 60) #Master
    else #Licensure;
  };
};
