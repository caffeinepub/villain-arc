import Common "common";

module {
  public type Theory = {
    id          : Common.TheoryId;
    name        : Text;
    description : Text;
    keyTheorists : [Text];
    keywords    : [Text];  // trigger keywords for rule engine
  };

  public type TheoryMatchResult = {
    theoryId    : Common.TheoryId;
    theoryName  : Text;
    confidence  : Nat;        // 0-100
    explanation : Text;
    matchedCaseIds : [Common.CaseId];
  };
};
