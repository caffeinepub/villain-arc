import List "mo:core/List";
import Map "mo:core/Map";
import Float "mo:core/Float";
import Types "../types/quiz";
import Common "../types/common";

module {
  public type CardStore = List.List<Types.Flashcard>;
  // Per-principal progress map: Principal -> (cardId -> CardProgress)
  public type ProgressStore = Map.Map<Principal, Map.Map<Common.CardId, Types.CardProgress>>;

  // ── Seed sample data ──────────────────────────────────────────────────────

  public func seedCards(store : CardStore) {
    let samples : [Types.Flashcard] = [
      // Terms (10)
      { id = 0; category = #Terms; hint = "Deviation from social norms";
        question = "What is 'deviance' in criminology?";
        answer = "Behavior that violates social norms or expectations, which may or may not be illegal." },
      { id = 1; category = #Terms; hint = "Learning crime socially";
        question = "Define 'differential association'.";
        answer = "Sutherland's theory that criminal behavior is learned through interaction with others who hold deviant attitudes." },
      { id = 2; category = #Terms; hint = "Bonds that prevent crime";
        question = "What is 'social control theory'?";
        answer = "Hirschi's theory that attachments, commitment, involvement, and belief in conventional society prevent delinquency." },
      { id = 3; category = #Terms; hint = "Strain between goals and means";
        question = "What is 'anomie' as used by Merton?";
        answer = "A social condition where culturally approved goals cannot be achieved through legitimate means, producing strain." },
      { id = 4; category = #Terms; hint = "Label sticks and shapes identity";
        question = "What is 'secondary deviance'?";
        answer = "Deviance that results from internalizing a deviant label imposed by others, shaping a deviant self-identity." },
      { id = 5; category = #Terms; hint = "Risk calculation before offending";
        question = "What does 'rational choice theory' propose?";
        answer = "Offenders weigh costs and benefits before committing crimes and choose to offend when expected gains outweigh risks." },
      { id = 6; category = #Terms; hint = "Where and when crimes cluster";
        question = "Define 'hot spot' in crime geography.";
        answer = "A small geographic area with a disproportionately high concentration of crime incidents." },
      { id = 7; category = #Terms; hint = "Motivated offender + target + no guardian";
        question = "What are the three elements of Routine Activity Theory?";
        answer = "A motivated offender, a suitable target, and the absence of a capable guardian converging in time and space." },
      { id = 8; category = #Terms; hint = "Biological + social interaction";
        question = "What is 'biosocial criminology'?";
        answer = "An approach studying how genetic, neurological, and environmental factors interact to influence criminal behavior." },
      { id = 9; category = #Terms; hint = "Unconscious drives and early trauma";
        question = "What is the psychodynamic explanation of crime?";
        answer = "Crime results from unresolved unconscious conflicts, often rooted in early childhood experiences and weak superego development." },

      // Theorists (10)
      { id = 10; category = #Theorists; hint = "Father of classical criminology";
        question = "Who is Cesare Beccaria and what is his central argument?";
        answer = "18th-century Italian jurist who argued punishment should be certain, swift, and proportional to deter crime." },
      { id = 11; category = #Theorists; hint = "Utilitarianism and the panopticon";
        question = "What did Jeremy Bentham contribute to criminology?";
        answer = "Applied utilitarian philosophy to punishment and designed the Panopticon prison to maximize surveillance and control." },
      { id = 12; category = #Theorists; hint = "Strain and five adaptations";
        question = "What is Robert Merton's contribution to strain theory?";
        answer = "Extended anomie theory with five modes of adaptation: conformity, innovation, ritualism, retreatism, and rebellion." },
      { id = 13; category = #Theorists; hint = "Social bonds and youth delinquency";
        question = "What did Travis Hirschi argue in 'Causes of Delinquency'?";
        answer = "Weak social bonds (attachment, commitment, involvement, belief) lead to delinquency when they fail to restrain individuals." },
      { id = 14; category = #Theorists; hint = "Labeling and moral entrepreneurship";
        question = "What is Howard Becker's contribution to labeling theory?";
        answer = "Deviance is not inherent but created by societal reactions; 'moral entrepreneurs' define and enforce rules." },
      { id = 15; category = #Theorists; hint = "Routine activities and lifestyle";
        question = "Who developed Routine Activity Theory?";
        answer = "Lawrence Cohen and Marcus Felson (1979) argued crime occurs when opportunity structures in daily life converge." },
      { id = 16; category = #Theorists; hint = "General theory of crime, self-control";
        question = "What is the General Theory of Crime by Gottfredson and Hirschi?";
        answer = "Low self-control, established in early childhood, is the primary predictor of criminal and analogous behaviors across the life course." },
      { id = 17; category = #Theorists; hint = "Techniques of neutralization";
        question = "What did Sykes and Matza argue?";
        answer = "Delinquents rationalize behavior through five neutralization techniques: denial of responsibility, injury, victim, condemnation, and appeal to higher loyalties." },
      { id = 18; category = #Theorists; hint = "Peacemaking criminology";
        question = "Who is Richard Quinney and what school does he represent?";
        answer = "Critical criminologist who argued crime is a social construct produced by capitalist power structures; later advocated peacemaking criminology." },
      { id = 19; category = #Theorists; hint = "Broken Windows author";
        question = "What is the 'Broken Windows' theory and who proposed it?";
        answer = "Wilson and Kelling (1982) argued that visible disorder signals low social control, inviting further crime if unaddressed." },

      // Studies (10)
      { id = 20; category = #Studies; hint = "Twin studies and heritability";
        question = "What did the Danish twin studies (Christiansen, 1977) find?";
        answer = "Monozygotic twins had higher concordance rates for criminality than dizygotic twins, suggesting a genetic component." },
      { id = 21; category = #Studies; hint = "Self-report delinquency measure";
        question = "What did Elliott et al.'s National Youth Survey reveal?";
        answer = "Self-reported delinquency was far more prevalent than official records suggested, and peaked in mid-adolescence." },
      { id = 22; category = #Studies; hint = "Philadelphia cohort study";
        question = "What did Wolfgang, Figlio, and Sellin's Philadelphia cohort study find?";
        answer = "6% of boys in the cohort ('chronic offenders') were responsible for over 50% of all offenses." },
      { id = 23; category = #Studies; hint = "Longitudinal Boston study";
        question = "What is the Glueck and Glueck study known for?";
        answer = "A longitudinal study comparing delinquents and non-delinquents, identifying family bonds, temperament, and school attachment as key predictors." },
      { id = 24; category = #Studies; hint = "Stanford prison experiment";
        question = "What did Zimbardo's Stanford Prison Experiment demonstrate?";
        answer = "Situational factors can rapidly produce abusive behavior; normal people adopt harmful roles when granted institutional power." },
      { id = 25; category = #Studies; hint = "Robbers Cave conflict study";
        question = "What did Sherif's Robbers Cave experiment show?";
        answer = "Intergroup competition creates hostility and prejudice; superordinate goals reduce intergroup conflict effectively." },
      { id = 26; category = #Studies; hint = "Milgram obedience study";
        question = "What is the criminological relevance of Milgram's obedience studies?";
        answer = "Showed that ordinary people can commit harmful acts under authority pressure, informing explanations of atrocities and organizational crime." },
      { id = 27; category = #Studies; hint = "Racial disparities in sentencing";
        question = "What did the Baldus Study (1983) examine?";
        answer = "Racial bias in Georgia death penalty cases; found defendants whose victims were white were significantly more likely to be sentenced to death." },
      { id = 28; category = #Studies; hint = "Police legitimacy and compliance";
        question = "What did Tom Tyler's 'Why People Obey the Law' study find?";
        answer = "People comply with law primarily due to perceived legitimacy and procedural fairness, not fear of punishment." },
      { id = 29; category = #Studies; hint = "MAOA gene and violence";
        question = "What did Caspi et al. (2002) study regarding the MAOA gene?";
        answer = "Found a gene-environment interaction: maltreated boys with low MAOA activity were significantly more likely to develop antisocial behavior." },

      // Disorders (10)
      { id = 30; category = #Disorders; hint = "Callousness without remorse";
        question = "What are the core features of Antisocial Personality Disorder (ASPD)?";
        answer = "Persistent pattern of disregard for others' rights, deceitfulness, impulsivity, aggression, and lack of remorse, emerging by age 15." },
      { id = 31; category = #Disorders; hint = "Manipulation and superficial charm";
        question = "How does psychopathy differ from ASPD?";
        answer = "Psychopathy includes affective features (shallow emotion, lack of empathy) and interpersonal traits (grandiosity, charm) beyond behavioral violations alone." },
      { id = 32; category = #Disorders; hint = "Hare PCL-R";
        question = "What is the Psychopathy Checklist–Revised (PCL-R)?";
        answer = "Hare's 20-item clinical rating scale assessing interpersonal, affective, lifestyle, and antisocial facets of psychopathy; scored 0–40." },
      { id = 33; category = #Disorders; hint = "Reality distortion and violence risk";
        question = "What is the relationship between schizophrenia and violent crime?";
        answer = "Small but statistically significant elevated risk, primarily during active psychosis; comorbid substance use substantially increases the risk." },
      { id = 34; category = #Disorders; hint = "Extreme mood swings";
        question = "How does bipolar disorder relate to criminal behavior?";
        answer = "Manic episodes can involve impulsivity and poor judgment leading to offenses; overall crime risk is elevated, especially with co-occurring substance abuse." },
      { id = 35; category = #Disorders; hint = "Conduct precursor in youth";
        question = "What is Conduct Disorder and its relationship to adult ASPD?";
        answer = "Childhood disorder involving aggression, rule violations, and deceitfulness; meeting criteria before 15 is required for an ASPD diagnosis in adulthood." },
      { id = 36; category = #Disorders; hint = "Explosive anger episodes";
        question = "What is Intermittent Explosive Disorder (IED)?";
        answer = "Recurrent, uncontrollable aggressive outbursts disproportionate to provocation, associated with impulsive violence and domestic abuse." },
      { id = 37; category = #Disorders; hint = "Pathological fire-setting";
        question = "What distinguishes pyromania from other fire-setting?";
        answer = "Pyromania involves deliberate, repetitive fire-setting driven by tension and fascination with fire, not profit, anger, or ideology." },
      { id = 38; category = #Disorders; hint = "Persistent stealing for tension relief";
        question = "What is kleptomania?";
        answer = "Recurrent failure to resist impulses to steal objects not needed for personal use or monetary value; tension precedes and relief follows the act." },
      { id = 39; category = #Disorders; hint = "Fragmented identity and trauma";
        question = "How is Dissociative Identity Disorder (DID) relevant in criminal justice?";
        answer = "Raises complex questions of criminal responsibility when alleged alternate identities commit offenses; courts generally reject it as a complete defense." },

      // Cases (10)
      { id = 40; category = #Cases; hint = "1966 University of Texas tower shooting";
        question = "What is the criminological significance of the Charles Whitman case?";
        answer = "Whitman's autopsy revealed a brain tumor; the case spurred debate on neurological factors in mass violence and early research into biosocial criminology." },
      { id = 41; category = #Cases; hint = "Organized vs. disorganized typology origin";
        question = "Why is Ted Bundy studied in forensic psychology?";
        answer = "Bundy exemplifies the 'organized' offender typology, demonstrating high intelligence, meticulous planning, and psychopathic manipulation across multiple states." },
      { id = 42; category = #Cases; hint = "Childhood trauma and serial offending";
        question = "What does Jeffrey Dahmer's case illustrate about developmental pathways to violence?";
        answer = "Early trauma, childhood neglect, social isolation, and untreated paraphilias converged; illustrates the role of developmental risk factors in extreme offending." },
      { id = 43; category = #Cases; hint = "Banality of evil and bureaucratic crime";
        question = "What does the Adolf Eichmann case contribute to criminological theory?";
        answer = "Hannah Arendt's 'banality of evil' thesis: ordinary people can commit mass atrocities through bureaucratic compliance without personal malice." },
      { id = 44; category = #Cases; hint = "Corporate fraud and white-collar crime";
        question = "What does the Enron scandal illustrate about white-collar crime?";
        answer = "Systematic accounting fraud enabled by organizational culture, weak oversight, and normalized deviance; contributed to Sutherland's white-collar crime framework." },
      { id = 45; category = #Cases; hint = "Neighborhood social disorganization";
        question = "How is the Central Park Five case relevant to criminology?";
        answer = "Illustrates wrongful conviction risks, coerced confessions, racial bias in criminal justice, and the power of media framing of crime." },
      { id = 46; category = #Cases; hint = "Insanity defense landmark";
        question = "What was the legal significance of the M'Naghten case (1843)?";
        answer = "Established the M'Naghten Rules: a defendant is not responsible if, due to mental disease, they did not know the nature of the act or that it was wrong." },
      { id = 47; category = #Cases; hint = "Bystander effect origins";
        question = "How did the Kitty Genovese murder influence criminological research?";
        answer = "Prompted research into the bystander effect; popularized the notion that diffusion of responsibility reduces intervention, though the original account was partly inaccurate." },
      { id = 48; category = #Cases; hint = "Lone wolf radicalization";
        question = "What does the Anders Breivik case illustrate?";
        answer = "Illustrates lone-actor terrorism, ideologically-motivated mass violence, radicalization without group affiliation, and debates over criminal responsibility and mental illness." },
      { id = 49; category = #Cases; hint = "Female offender and gender gap";
        question = "What does the Aileen Wuornos case contribute to feminist criminology?";
        answer = "Raises questions about gendered pathways to crime, victimization preceding offending, and how the criminal justice system treats female defendants." },

      // Research Methods (9)
      { id = 50; category = #ResearchMethods; hint = "Following the same group over time";
        question = "What is a longitudinal cohort study?";
        answer = "A research design tracking the same group of individuals over an extended period to observe how variables change and predict outcomes." },
      { id = 51; category = #ResearchMethods; hint = "Official records vs. self-report";
        question = "What is the 'dark figure of crime'?";
        answer = "The gap between officially recorded crime and actual crime committed; self-report and victimization surveys attempt to measure it." },
      { id = 52; category = #ResearchMethods; hint = "Random assignment to conditions";
        question = "What is a randomized controlled trial (RCT) in criminological research?";
        answer = "An experiment where participants are randomly assigned to treatment and control groups to establish causal effects of an intervention." },
      { id = 53; category = #ResearchMethods; hint = "National victimization data";
        question = "What is the National Crime Victimization Survey (NCVS)?";
        answer = "A U.S. Bureau of Justice Statistics survey measuring household victimization rates, capturing crimes not reported to police." },
      { id = 54; category = #ResearchMethods; hint = "Aggregate crime statistics";
        question = "What are the Uniform Crime Reports (UCR)?";
        answer = "FBI-compiled annual statistics of crimes reported to police; recently transitioning to the National Incident-Based Reporting System (NIBRS)." },
      { id = 55; category = #ResearchMethods; hint = "Systematic review of multiple studies";
        question = "What is a meta-analysis in criminological research?";
        answer = "A statistical technique synthesizing results from multiple studies to estimate overall effect sizes and identify consistent patterns." },
      { id = 56; category = #ResearchMethods; hint = "Researcher embeds in a setting";
        question = "What is ethnographic research and its value in criminology?";
        answer = "Immersive qualitative observation within a community or group; reveals lived experiences, cultural codes, and processes invisible to survey methods." },
      { id = 57; category = #ResearchMethods; hint = "Crime mapping and spatial analysis";
        question = "What is geographic information systems (GIS) analysis in criminology?";
        answer = "Using spatial data tools to map crime patterns, identify hotspots, and analyze environmental factors contributing to crime concentration." },
      { id = 58; category = #ResearchMethods; hint = "Twins and adoption studies";
        question = "How are behavior genetics methods used in criminology?";
        answer = "Twin and adoption studies partition variance in criminal behavior into genetic, shared environmental, and non-shared environmental components." },

      // Terminology (11)
      { id = 59; category = #Terminology; hint = "Repeat offending pattern";
        question = "What is 'recidivism'?";
        answer = "The tendency of a convicted criminal to reoffend; measured as re-arrest, reconviction, or re-incarceration within a defined period." },
      { id = 60; category = #Terminology; hint = "Deterrence through punishment";
        question = "Distinguish 'specific' from 'general' deterrence.";
        answer = "Specific deterrence targets the individual offender; general deterrence aims to discourage the broader population through publicized punishment." },
      { id = 61; category = #Terminology; hint = "Preventing future offending through incapacitation";
        question = "What is 'incapacitation' as a goal of punishment?";
        answer = "Preventing crime by physically removing the offender from society through incarceration, thereby blocking opportunity to reoffend." },
      { id = 62; category = #Terminology; hint = "Returning offender to society";
        question = "What is 'rehabilitation' in criminal justice?";
        answer = "Interventions aimed at reforming offenders' attitudes, skills, and behaviors to reduce reoffending and reintegrate them into society." },
      { id = 63; category = #Terminology; hint = "Just deserts philosophy";
        question = "What is 'retributive justice'?";
        answer = "The view that punishment is morally deserved as a proportional response to wrongdoing, independent of deterrent or rehabilitative effects." },
      { id = 64; category = #Terminology; hint = "Repairing harm to victims and community";
        question = "What is 'restorative justice'?";
        answer = "An approach that focuses on repairing harm through cooperative processes involving victims, offenders, and community rather than punitive sanctions." },
      { id = 65; category = #Terminology; hint = "Offender profiling approach";
        question = "What is 'criminal profiling'?";
        answer = "Inferring offender characteristics from crime scene evidence and behavioral patterns to narrow investigative focus; reliability is debated in the literature." },
      { id = 66; category = #Terminology; hint = "Criminal trajectory over life";
        question = "What is the 'age-crime curve'?";
        answer = "The well-replicated finding that criminal activity peaks in late adolescence (around ages 16-17) and declines sharply through the twenties." },
      { id = 67; category = #Terminology; hint = "Power over vulnerable victims";
        question = "What is 'predatory crime'?";
        answer = "Offenses characterized by deliberate targeting of vulnerable individuals for personal gain or gratification, including robbery, rape, and certain homicides." },
      { id = 68; category = #Terminology; hint = "Crimes of the powerful";
        question = "What distinguishes 'white-collar crime' from street crime?";
        answer = "White-collar crime is committed by persons of respectability in the course of their occupation; causes greater aggregate economic harm despite lower prosecution rates." },
      { id = 69; category = #Terminology; hint = "Socially constructed rule violations";
        question = "What is the 'social constructionist' view of crime?";
        answer = "Crime has no objective existence; it is a label applied through social, political, and legal processes reflecting power relations rather than inherent harm." },
    ];

    for (card in samples.vals()) {
      store.add(card);
    };
  };

  // ── Card queries ──────────────────────────────────────────────────────────

  public func listAll(store : CardStore) : [Types.Flashcard] {
    store.toArray();
  };

  public func listByCategory(
    store    : CardStore,
    category : Types.CardCategory,
  ) : [Types.Flashcard] {
    store.toArray().filter(func(c : Types.Flashcard) : Bool { c.category == category });
  };

  // Cards whose nextReview <= now for the given principal, or all cards if no progress exists
  public func getDueCards(
    cardStore     : CardStore,
    progressStore : ProgressStore,
    principal     : Principal,
    now           : Common.Timestamp,
  ) : [Types.Flashcard] {
    let allCards = cardStore.toArray();
    switch (progressStore.get(principal)) {
      case null {
        // No progress yet — all cards are due
        allCards;
      };
      case (?userProgress) {
        allCards.filter(func(card : Types.Flashcard) : Bool {
          switch (userProgress.get(card.id)) {
            case null true;                            // never reviewed → due
            case (?p)  { p.nextReview <= now };
          };
        });
      };
    };
  };

  // ── SM-2 algorithm ────────────────────────────────────────────────────────

  // Returns updated CardProgress after applying SM-2.
  // quality 4 (#Known): interval *= easeFactor, easeFactor += 0.1, repetitions += 1
  // quality 0 (#NeedsReview): interval = 1, easeFactor = max(1.3, easeFactor - 0.2), repetitions = 0
  func applySmTwo(
    prev    : Types.CardProgress,
    quality : Types.ReviewQuality,
    now     : Common.Timestamp,
  ) : Types.CardProgress {
    let dayNs : Int = 86_400_000_000_000; // 1 day in nanoseconds

    switch quality {
      case (#Known) {
        let newEase     = prev.easeFactor + 0.1;
        let newInterval : Nat = if (prev.repetitions == 0) {
          1
        } else if (prev.repetitions == 1) {
          6
        } else {
          // interval * easeFactor, truncated to Nat
          let scaled : Float = prev.intervalDays.toFloat() * newEase;
          let asInt  : Int   = scaled.toInt();
          if (asInt < 1) 1 else asInt.toNat();
        };
        let nextRev = now + newInterval.toInt() * dayNs;
        {
          prev with
          easeFactor   = newEase;
          intervalDays = newInterval;
          repetitions  = prev.repetitions + 1;
          nextReview   = nextRev;
          lastReviewed = now;
        };
      };
      case (#NeedsReview) {
        let newEase = if (prev.easeFactor - 0.2 < 1.3) 1.3 else prev.easeFactor - 0.2;
        let nextRev = now + dayNs;
        {
          prev with
          easeFactor   = newEase;
          intervalDays = 1;
          repetitions  = 0;
          nextReview   = nextRev;
          lastReviewed = now;
        };
      };
    };
  };

  public func updateProgress(
    progressStore : ProgressStore,
    principal     : Principal,
    cardId        : Common.CardId,
    quality       : Types.ReviewQuality,
    now           : Common.Timestamp,
  ) {
    // Get or create this user's progress map
    let userProgress : Map.Map<Common.CardId, Types.CardProgress> = switch (progressStore.get(principal)) {
      case (?m) m;
      case null {
        let m = Map.empty<Common.CardId, Types.CardProgress>();
        progressStore.add(principal, m);
        m;
      };
    };

    // Get existing progress or create default
    let existing : Types.CardProgress = switch (userProgress.get(cardId)) {
      case (?p) p;
      case null {
        {
          cardId       = cardId;
          easeFactor   = 2.5;
          intervalDays = 1;
          repetitions  = 0;
          nextReview   = now;
          lastReviewed = now;
        };
      };
    };

    let updated = applySmTwo(existing, quality, now);
    userProgress.add(cardId, updated);
  };

  // ── Session summary ───────────────────────────────────────────────────────

  public func getSessionSummary(
    cardStore     : CardStore,
    progressStore : ProgressStore,
    principal     : Principal,
    now           : Common.Timestamp,
  ) : Types.SessionSummary {
    let totalCards = cardStore.size();

    switch (progressStore.get(principal)) {
      case null {
        {
          totalCards    = totalCards;
          cardsReviewed = 0;
          retentionPct  = 0;
          dueCount      = totalCards;
          nextReviewDates = [];
        };
      };
      case (?userProgress) {
        let reviewed   = userProgress.size();
        let allCards   = cardStore.toArray();
        var dueCount   = 0;
        var knownCount = 0;

        let nextDates = allCards.filter(func(card : Types.Flashcard) : Bool {
          switch (userProgress.get(card.id)) {
            case null {
              dueCount += 1;
              false;
            };
            case (?p) {
              if (p.nextReview <= now) {
                dueCount += 1;
                false;
              } else {
                if (p.repetitions > 0) { knownCount += 1 };
                true;
              };
            };
          };
        }).map(func(card : Types.Flashcard) : Common.Timestamp {
          switch (userProgress.get(card.id)) {
            case (?p) p.nextReview;
            case null now;
          };
        });

        let retentionPct : Nat = if (reviewed == 0) 0 else {
          let pct = (knownCount * 100) / reviewed;
          pct;
        };

        {
          totalCards      = totalCards;
          cardsReviewed   = reviewed;
          retentionPct    = retentionPct;
          dueCount        = dueCount;
          nextReviewDates = nextDates;
        };
      };
    };
  };
};
