import Common "common";

module {
  public type CrimeCategory = Text;

  public type Case = {
    id        : Common.CaseId;
    name      : Text;
    alias     : Text;
    category  : CrimeCategory;
    year      : Nat;
    dsmProfile : Text;
    theories  : [Common.TheoryId];
    quotes    : [Text];
    summary   : Text;
    severity  : Nat;   // 1-10
    notoriety : Nat;   // 1-10
  };
};
