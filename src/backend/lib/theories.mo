import List "mo:core/List";
import Array "mo:core/Array";
import Types "../types/theories";
import Common "../types/common";

module {
  public type TheoryStore = List.List<Types.Theory>;

  // Seed the 8 canonical criminology theories into the store.
  // Idempotent: only seeds if the store is empty.
  public func seedTheories(store : TheoryStore) {
    if (store.size() > 0) return;

    let theories : [Types.Theory] = [
      {
        id = "strain";
        name = "Strain Theory";
        description = "Proposes that social structures pressure individuals to commit crime when legitimate means to achieve culturally valued goals are blocked. Developed by Merton, refined by Agnew.";
        keyTheorists = ["Robert Merton", "Robert Agnew"];
        keywords = [
          "blocked", "goal", "success", "poverty", "inequality", "frustration",
          "legitimate", "opportunity", "status", "aspiration", "socioeconomic",
          "strain", "anomie", "deprivation", "class", "wealth", "poor",
          "disadvantage", "structural", "achieve",
        ];
      },
      {
        id = "rational_choice";
        name = "Rational Choice Theory";
        description = "Assumes offenders are rational actors who weigh costs and benefits before committing a crime. Crime occurs when perceived benefits outweigh perceived risks.";
        keyTheorists = ["Ronald Clarke", "Derek Cornish", "Gary Becker"];
        keywords = [
          "rational", "choice", "benefit", "cost", "risk", "reward", "calculate",
          "deliberate", "planned", "decision", "premeditated", "motive", "gain",
          "profit", "opportunity", "target", "deterrence", "incentive", "weigh",
          "consequences",
        ];
      },
      {
        id = "biosocial";
        name = "Biosocial Theory";
        description = "Integrates biological factors (genetics, neurochemistry, physiology) with social environments to explain criminal behavior. Suggests biology interacts with environment to shape propensity for crime.";
        keyTheorists = ["Adrian Raine", "C. Ray Jeffery", "Kevin Beaver"];
        keywords = [
          "genetic", "biological", "brain", "neurology", "hormone", "testosterone",
          "hereditary", "chromosome", "twin", "IQ", "impulsive", "physiology",
          "neurological", "serotonin", "dopamine", "nature", "inherited", "disorder",
          "mental", "cognitive",
        ];
      },
      {
        id = "social_learning";
        name = "Social Learning Theory";
        description = "Argues that criminal behavior is learned through interaction with others, particularly through imitation, reinforcement, and exposure to deviant attitudes. Derived from Sutherland's differential association.";
        keyTheorists = ["Edwin Sutherland", "Ronald Akers", "Albert Bandura"];
        keywords = [
          "learn", "imitate", "peer", "influence", "associate", "gang", "group",
          "model", "reinforce", "observe", "family", "friend", "culture",
          "exposure", "neighborhood", "differential", "definition", "norm",
          "attitude", "behavior",
        ];
      },
      {
        id = "labeling";
        name = "Labeling Theory";
        description = "Contends that deviance is not inherent to an act but is constructed through society's reaction to it. Being officially labeled as criminal can push individuals toward a deviant identity and further crime.";
        keyTheorists = ["Howard Becker", "Edwin Lemert", "Frank Tannenbaum"];
        keywords = [
          "label", "stigma", "identity", "deviant", "stereotype", "reaction",
          "society", "criminal record", "arrest", "convicted", "incarcerated",
          "secondary", "primary", "perception", "reintegration", "recidivism",
          "master status", "outsider", "self-fulfilling", "shame",
        ];
      },
      {
        id = "routine_activity";
        name = "Routine Activity Theory";
        description = "Explains crime occurrence as the convergence of three elements: a motivated offender, a suitable target, and the absence of a capable guardian. Lifestyle and daily routines shape victimization risk.";
        keyTheorists = ["Lawrence Cohen", "Marcus Felson"];
        keywords = [
          "routine", "activity", "guardian", "target", "offender", "opportunity",
          "lifestyle", "victim", "place", "convergence", "time", "location",
          "unguarded", "suitable", "daily", "schedule", "space", "environment",
          "surveillance", "situation",
        ];
      },
      {
        id = "psychodynamic";
        name = "Psychodynamic Theory";
        description = "Rooted in Freudian psychology, this theory links criminal behavior to unconscious conflicts, unresolved childhood trauma, weak ego development, and repressed drives. Emphasizes internal psychological mechanisms.";
        keyTheorists = ["Sigmund Freud", "August Aichhorn", "John Bowlby"];
        keywords = [
          "unconscious", "trauma", "childhood", "repressed", "ego", "id",
          "superego", "attachment", "abuse", "neglect", "psyche", "instinct",
          "drive", "aggression", "fantasy", "narcissism", "psychosis", "paranoia",
          "emotion", "early",
        ];
      },
      {
        id = "general_strain";
        name = "General Strain Theory";
        description = "Agnew's extension of strain theory proposes three sources of strain: failure to achieve goals, removal of positive stimuli, and presentation of negative stimuli. Negative emotions (anger, frustration) mediate the strain-crime link.";
        keyTheorists = ["Robert Agnew"];
        keywords = [
          "anger", "negative emotion", "stress", "loss", "abuse", "bullying",
          "humiliation", "rejection", "failure", "victimization", "pressure",
          "injustice", "unfair", "general strain", "coping", "frustration",
          "negative stimuli", "withdraw", "emotional", "retaliation",
        ];
      },
    ];

    for (theory in theories.vals()) {
      store.add(theory);
    };
  };

  public func listAll(store : TheoryStore) : [Types.Theory] {
    store.toArray();
  };

  public func getById(store : TheoryStore, id : Common.TheoryId) : ?Types.Theory {
    store.find(func(t) { t.id == id });
  };

  // Deterministic rule engine: score scenario text against each theory's keywords.
  // Confidence = min(100, matchCount * 10).
  // Results sorted descending by confidence; zero-confidence theories excluded.
  public func matchScenario(
    store    : TheoryStore,
    scenario : Text,
    cases    : [{ id : Common.CaseId; theories : [Common.TheoryId] }],
  ) : [Types.TheoryMatchResult] {
    let lower = scenario.toLower();

    let scored = store.filterMap<Types.Theory, Types.TheoryMatchResult>(
      func(theory : Types.Theory) : ?Types.TheoryMatchResult {
        var matchCount : Nat = 0;
        for (kw in theory.keywords.vals()) {
          if (lower.contains(#text kw)) {
            matchCount += 1;
          };
        };
        if (matchCount == 0) return null;

        let confidence = if (matchCount * 10 > 100) 100 else matchCount * 10;

        let explanation = buildExplanation(theory, matchCount);

        // Collect case IDs whose theory list includes this theory
        let matchedCaseIds = cases.filterMap(
          func(c : { id : Common.CaseId; theories : [Common.TheoryId] }) : ?Common.CaseId {
            if (c.theories.any(func(tid : Common.TheoryId) : Bool { tid == theory.id })) {
              ?c.id
            } else {
              null
            };
          },
        );

        ?{
          theoryId       = theory.id;
          theoryName     = theory.name;
          confidence;
          explanation;
          matchedCaseIds;
        };
      }
    );

    // Sort descending by confidence
    let arr = scored.toArray();
    arr.sort(func(a : Types.TheoryMatchResult, b : Types.TheoryMatchResult) : { #less; #equal; #greater } {
      if (a.confidence > b.confidence) #less
      else if (a.confidence < b.confidence) #greater
      else #equal
    });
  };

  // Build a contextual explanation snippet for a match result.
  private func buildExplanation(theory : Types.Theory, matchCount : Nat) : Text {
    let countText = matchCount.toText();
    "The scenario aligns with " # theory.name # " based on " # countText #
    " keyword indicator(s). " # theory.description;
  };
};
