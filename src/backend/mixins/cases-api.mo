import CasesLib "../lib/cases";
import CaseTypes "../types/cases";
import Common "../types/common";

mixin (cases : CasesLib.CaseStore) {

  public query func listCases() : async [CaseTypes.Case] {
    CasesLib.listAll(cases);
  };

  public query func getCase(id : Common.CaseId) : async ?CaseTypes.Case {
    CasesLib.getById(cases, id);
  };

  public query func searchCases(
    name        : ?Text,
    category    : ?Text,
    yearFrom    : ?Nat,
    yearTo      : ?Nat,
    minSeverity : ?Nat,
  ) : async [CaseTypes.Case] {
    CasesLib.search(cases, name, category, yearFrom, yearTo, minSeverity);
  };
};
