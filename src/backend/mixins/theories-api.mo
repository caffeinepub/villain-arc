import List "mo:core/List";
import TheoriesLib "../lib/theories";
import TheoryTypes "../types/theories";
import CaseTypes "../types/cases";
import Common "../types/common";

mixin (theories : TheoriesLib.TheoryStore, cases : List.List<CaseTypes.Case>) {

  public query func listTheories() : async [TheoryTypes.Theory] {
    TheoriesLib.listAll(theories);
  };

  public query func getTheory(id : Common.TheoryId) : async ?TheoryTypes.Theory {
    TheoriesLib.getById(theories, id);
  };

  public query func matchTheories(scenario : Text) : async [TheoryTypes.TheoryMatchResult] {
    let caseSlices = cases.map<CaseTypes.Case, { id : Common.CaseId; theories : [Common.TheoryId] }>(
      func(c) { { id = c.id; theories = c.theories } }
    ).toArray();
    TheoriesLib.matchScenario(theories, scenario, caseSlices);
  };
};
