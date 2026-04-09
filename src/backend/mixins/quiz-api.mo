import Time "mo:core/Time";
import QuizLib "../lib/quiz";
import QuizTypes "../types/quiz";
import Common "../types/common";

mixin (cards : QuizLib.CardStore, progress : QuizLib.ProgressStore) {

  public query func listCards() : async [QuizTypes.Flashcard] {
    QuizLib.listAll(cards);
  };

  public query func listCardsByCategory(category : QuizTypes.CardCategory) : async [QuizTypes.Flashcard] {
    QuizLib.listByCategory(cards, category);
  };

  // Returns cards due for review for the authenticated caller
  public shared ({ caller }) func getDueCards() : async [QuizTypes.Flashcard] {
    let now : Common.Timestamp = Time.now();
    QuizLib.getDueCards(cards, progress, caller, now);
  };

  public shared ({ caller }) func reviewCard(cardId : Common.CardId, quality : QuizTypes.ReviewQuality) : async () {
    let now : Common.Timestamp = Time.now();
    QuizLib.updateProgress(progress, caller, cardId, quality, now);
  };

  public shared ({ caller }) func getSessionSummary() : async QuizTypes.SessionSummary {
    let now : Common.Timestamp = Time.now();
    QuizLib.getSessionSummary(cards, progress, caller, now);
  };
};
