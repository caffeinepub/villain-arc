module {
  public type Timestamp = Int;
  public type CaseId = Nat;
  public type CardId = Nat;
  public type JournalEntryId = Nat;
  public type TheoryId = Text;

  public type Milestone = {
    #Associate;   // 0-10 entries
    #Bachelor;    // 11-30 entries
    #Master;      // 31-60 entries
    #Licensure;   // 61+ entries
  };
};
