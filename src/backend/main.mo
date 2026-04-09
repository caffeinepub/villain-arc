import List "mo:core/List";
import Map "mo:core/Map";
import CasesLib "lib/cases";
import TheoriesLib "lib/theories";
import QuizLib "lib/quiz";
import JournalLib "lib/journal";
import CaseTypes "types/cases";
import CasesMixin "mixins/cases-api";
import TheoriesMixin "mixins/theories-api";
import QuizMixin "mixins/quiz-api";
import JournalMixin "mixins/journal-api";

actor {
  // --- Shared state ---
  let cases       : CasesLib.CaseStore    = List.empty<CaseTypes.Case>();
  let theories    : TheoriesLib.TheoryStore = List.empty();
  let cards       : QuizLib.CardStore      = List.empty();
  let quizProgress : QuizLib.ProgressStore = Map.empty();
  let journal     : JournalLib.JournalStore    = Map.empty();
  let journalIds  : JournalLib.IdCounterStore  = Map.empty();

  // --- Seed sample data at init ---
  CasesLib.seedCases(cases);
  TheoriesLib.seedTheories(theories);
  QuizLib.seedCards(cards);

  // --- Compose mixins ---
  include CasesMixin(cases);
  include TheoriesMixin(theories, cases);
  include QuizMixin(cards, quizProgress);
  include JournalMixin(journal, journalIds);
};
