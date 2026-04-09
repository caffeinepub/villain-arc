import Time "mo:core/Time";
import JournalLib "../lib/journal";
import JournalTypes "../types/journal";
import Common "../types/common";

mixin (journal : JournalLib.JournalStore, journalIds : JournalLib.IdCounterStore) {

  public shared ({ caller }) func createJournalEntry(input : JournalTypes.JournalEntryInput) : async JournalTypes.JournalEntry {
    let now = Time.now();
    JournalLib.createEntry(journal, journalIds, caller, input, now);
  };

  public shared ({ caller }) func updateJournalEntry(
    id    : Common.JournalEntryId,
    input : JournalTypes.JournalEntryInput,
  ) : async ?JournalTypes.JournalEntry {
    let now = Time.now();
    JournalLib.updateEntry(journal, caller, id, input, now);
  };

  public shared ({ caller }) func deleteJournalEntry(id : Common.JournalEntryId) : async Bool {
    JournalLib.deleteEntry(journal, caller, id);
  };

  public query ({ caller }) func listJournalEntries(page : Nat, pageSize : Nat) : async JournalTypes.JournalPage {
    JournalLib.listEntries(journal, caller, page, pageSize);
  };

  public query ({ caller }) func getJournalEntry(id : Common.JournalEntryId) : async ?JournalTypes.JournalEntry {
    JournalLib.getEntry(journal, caller, id);
  };

  public query ({ caller }) func searchJournalEntries(
    fromDate : ?Common.Timestamp,
    toDate   : ?Common.Timestamp,
    tag      : ?Text,
    keyword  : ?Text,
  ) : async [JournalTypes.JournalEntry] {
    JournalLib.searchEntries(journal, caller, fromDate, toDate, tag, keyword);
  };

  public query ({ caller }) func getJournalMilestone() : async Common.Milestone {
    let count = switch (journal.get(caller)) {
      case null 0;
      case (?list) list.size();
    };
    JournalLib.getMilestone(count);
  };
};
