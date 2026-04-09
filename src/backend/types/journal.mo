import Common "common";

module {
  public type JournalEntry = {
    id          : Common.JournalEntryId;
    title       : Text;
    body        : Text;   // rich-text HTML
    tags        : [Text];
    caseRefs    : [Common.CaseId];
    theoryRefs  : [Common.TheoryId];
    createdAt   : Common.Timestamp;
    updatedAt   : Common.Timestamp;
  };

  public type JournalEntryInput = {
    title      : Text;
    body       : Text;
    tags       : [Text];
    caseRefs   : [Common.CaseId];
    theoryRefs : [Common.TheoryId];
  };

  public type JournalPage = {
    entries    : [JournalEntry];
    totalCount : Nat;
    page       : Nat;
    pageSize   : Nat;
  };
};
