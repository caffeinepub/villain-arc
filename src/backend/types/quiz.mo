import Common "common";

module {
  public type CardCategory = {
    #Terms;
    #Theorists;
    #Studies;
    #Disorders;
    #Cases;
    #ResearchMethods;
    #Terminology;
  };

  public type Flashcard = {
    id       : Common.CardId;
    question : Text;
    answer   : Text;
    category : CardCategory;
    hint     : Text;
  };

  // Per-principal SM-2 progress for a single card
  public type CardProgress = {
    cardId       : Common.CardId;
    easeFactor   : Float;     // SM-2 ease factor, starts at 2.5
    intervalDays : Nat;       // days until next review
    repetitions  : Nat;       // number of successful reviews
    nextReview   : Common.Timestamp;  // epoch nanoseconds
    lastReviewed : Common.Timestamp;  // epoch nanoseconds
  };

  public type ReviewQuality = {
    #Known;        // quality 4
    #NeedsReview;  // quality 0
  };

  public type SessionSummary = {
    totalCards     : Nat;
    cardsReviewed  : Nat;
    retentionPct   : Nat;   // 0-100
    dueCount       : Nat;
    nextReviewDates : [Common.Timestamp];
  };
};
