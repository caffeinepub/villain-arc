import List "mo:core/List";
import Types "../types/cases";
import Common "../types/common";

module {
  public type CaseStore = List.List<Types.Case>;

  public func seedCases(store : CaseStore) {
    let samples : [Types.Case] = [
      {
        id        = 1;
        name      = "Ted Bundy";
        alias     = "The Campus Killer";
        category  = "Serial Homicide";
        year      = 1974;
        dsmProfile = "Antisocial Personality Disorder; psychopathic traits including superficial charm, pathological lying, and lack of remorse";
        theories  = ["social_learning", "psychodynamic", "rational_choice"];
        quotes    = [
          "I'm the most cold-hearted son of a bitch you'll ever meet.",
          "We serial killers are your sons, we are your husbands, we are everywhere."
        ];
        summary   = "Theodore Robert Bundy was an American serial killer who kidnapped, assaulted, and murdered numerous young women across several states during the 1970s. His case became foundational to criminal profiling methodology and highlighted the limitations of early forensic investigation.";
        severity  = 10;
        notoriety = 10;
      },
      {
        id        = 2;
        name      = "Jeffrey Dahmer";
        alias     = "The Milwaukee Cannibal";
        category  = "Serial Homicide";
        year      = 1978;
        dsmProfile = "Borderline Personality Disorder; schizotypal features; necrophilia; documented paraphilic disorders";
        theories  = ["psychodynamic", "social_learning", "strain"];
        quotes    = [
          "I carried it too far, that's for sure.",
          "The only motive that there ever was, was to completely control a person."
        ];
        summary   = "Jeffrey Lionel Dahmer was an American serial killer who committed the murder and dismemberment of seventeen men and boys between 1978 and 1991. His case contributed significantly to clinical understanding of paraphilic disorders and the intersection of childhood trauma with violent behavior.";
        severity  = 10;
        notoriety = 10;
      },
      {
        id        = 3;
        name      = "John Wayne Gacy";
        alias     = "The Killer Clown";
        category  = "Serial Homicide";
        year      = 1972;
        dsmProfile = "Antisocial Personality Disorder; paranoid features; sexual sadism disorder";
        theories  = ["psychodynamic", "social_learning", "labeling"];
        quotes    = [
          "A clown can get away with murder.",
          "I should never have been convicted of anything more serious than running a cemetery without a license."
        ];
        summary   = "John Wayne Gacy was an American serial killer and sex offender who assaulted and murdered at least 33 young men and boys in Cook County, Illinois. His outward social respectability as a community figure became a landmark study in the psychology of the mask of sanity.";
        severity  = 10;
        notoriety = 9;
      },
      {
        id        = 4;
        name      = "Dennis Rader";
        alias     = "BTK Killer";
        category  = "Serial Homicide";
        year      = 1974;
        dsmProfile = "Sexual sadism disorder; narcissistic personality features; no evidence of psychosis";
        theories  = ["routine_activity", "rational_choice", "psychodynamic"];
        quotes    = [
          "The BTK story is far from over.",
          "I actually think I may be possessed with demons."
        ];
        summary   = "Dennis Lynn Rader, known as BTK (Bind, Torture, Kill), murdered ten people in Wichita, Kansas between 1974 and 1991. His case is studied extensively for its insights into the organized offender typology, self-dramatization, and the role of fantasy in serial predation.";
        severity  = 9;
        notoriety = 9;
      },
      {
        id        = 5;
        name      = "Charles Manson";
        alias     = "Charlie";
        category  = "Cult-Directed Homicide";
        year      = 1969;
        dsmProfile = "Paranoid personality disorder; antisocial features; cult manipulation; documented delusions of grandeur";
        theories  = ["social_learning", "labeling", "strain"];
        quotes    = [
          "I am only what you made me. I am only a reflection of you.",
          "Total paranoia is just total awareness."
        ];
        summary   = "Charles Milles Manson was an American cult leader whose followers, known as the Manson Family, committed a series of nine murders in 1969. His case is central to criminological study of coercive control, group dynamics in violence, and the construction of criminal charisma.";
        severity  = 9;
        notoriety = 10;
      },
      {
        id        = 6;
        name      = "Edmund Kemper";
        alias     = "The Co-ed Killer";
        category  = "Serial Homicide";
        year      = 1964;
        dsmProfile = "Antisocial Personality Disorder; high IQ; sexual sadism; documented matricidal fixation";
        theories  = ["psychodynamic", "biosocial", "social_learning"];
        quotes    = [
          "I just wanted to see what it felt like to shoot grandma.",
          "With a girl, there's a lot you can do. A man, there's not much you can do."
        ];
        summary   = "Edmund Emil Kemper III is an American serial killer who murdered ten people, including his paternal grandparents, six female hitchhikers, and his own mother. His willingness to cooperate with FBI behavioral scientists made him instrumental in developing the criminal profiling methodology used to this day.";
        severity  = 9;
        notoriety = 8;
      },
      {
        id        = 7;
        name      = "Aileen Wuornos";
        alias     = "Damsel of Death";
        category  = "Serial Homicide";
        year      = 1989;
        dsmProfile = "Borderline Personality Disorder; antisocial features; documented history of childhood abuse and trauma";
        theories  = ["strain", "biosocial", "psychodynamic", "routine_activity"];
        quotes    = [
          "I robbed them, and I killed them as cold as ice, and I would do it again.",
          "I'm one who seriously hates human life and would kill again."
        ];
        summary   = "Aileen Carol Wuornos was an American serial killer who murdered seven men in Florida between 1989 and 1990. Her case is frequently examined through feminist criminology and the general strain theory lens, as her documented history of abuse challenges traditional male-centric serial offender models.";
        severity  = 8;
        notoriety = 9;
      },
      {
        id        = 8;
        name      = "Gary Ridgway";
        alias     = "Green River Killer";
        category  = "Serial Homicide";
        year      = 1982;
        dsmProfile = "Antisocial Personality Disorder; sexual sadism; no psychosis; average IQ with targeted victim selection";
        theories  = ["routine_activity", "rational_choice", "biosocial"];
        quotes    = [
          "I picked prostitutes as my victims because I hate most prostitutes and I did not want to pay them for sex.",
          "I wanted to kill as many women as I thought were prostitutes as I possibly could."
        ];
        summary   = "Gary Leon Ridgway, the Green River Killer, confessed to the murders of 49 women in Washington State during the 1980s and 1990s, making him one of the most prolific convicted serial killers in American history. His case is studied for victim selection patterns, geographic profiling, and the use of DNA evidence in cold-case resolution.";
        severity  = 10;
        notoriety = 9;
      },
      {
        id        = 9;
        name      = "David Berkowitz";
        alias     = "Son of Sam";
        category  = "Serial Homicide";
        year      = 1976;
        dsmProfile = "Paranoid personality disorder; delusional ideation; no primary psychosis diagnosis at trial; later claimed demon-commanded motivation";
        theories  = ["psychodynamic", "labeling", "strain"];
        quotes    = [
          "I am the monster. I am the Son of Sam.",
          "I was literally singing to myself on my way home, after the killing."
        ];
        summary   = "David Richard Berkowitz, known as the Son of Sam, killed six people and wounded seven others in New York City between 1976 and 1977. His case prompted a landmark legal reform—the Son of Sam laws—prohibiting offenders from profiting from their crimes through media deals.";
        severity  = 8;
        notoriety = 9;
      },
      {
        id        = 10;
        name      = "Richard Ramirez";
        alias     = "The Night Stalker";
        category  = "Serial Homicide";
        year      = 1984;
        dsmProfile = "Antisocial Personality Disorder; sadistic features; substance-induced perceptual disturbances; satanic ideation";
        theories  = ["social_learning", "biosocial", "routine_activity"];
        quotes    = [
          "We are all evil in some form or another.",
          "Big deal. Death always went with the territory."
        ];
        summary   = "Ricardo Leyva Muñoz Ramírez, known as the Night Stalker, was an American serial killer, rapist, and burglar who terrorized Southern California and San Francisco between 1984 and 1985. His case is examined in studies of disorganized offender typology and the psychological impact of violent media exposure in childhood.";
        severity  = 10;
        notoriety = 9;
      },
      {
        id        = 11;
        name      = "H. H. Holmes";
        alias     = "America's First Serial Killer";
        category  = "Serial Homicide";
        year      = 1891;
        dsmProfile = "Psychopathy; antisocial and narcissistic personality features; predatory manipulation; documented insurance fraud and confidence schemes";
        theories  = ["rational_choice", "psychodynamic", "strain"];
        quotes    = [
          "I was born with the devil in me.",
          "I could not help the fact that I was a murderer, no more than the poet can help the inspiration to sing."
        ];
        summary   = "Herman Webster Mudgett, known as H. H. Holmes, was an American con artist and serial killer active in the late nineteenth century. He constructed a hotel in Chicago—dubbed the Murder Castle—equipped with gas lines and a crematorium. His case predates modern forensic science and is studied as an early example of premeditated, financially motivated serial predation.";
        severity  = 9;
        notoriety = 8;
      },
      {
        id        = 12;
        name      = "Zodiac Killer";
        alias     = "Zodiac";
        category  = "Unresolved Serial Homicide";
        year      = 1968;
        dsmProfile = "Speculative: narcissistic and paranoid features inferred from correspondence; no confirmed diagnosis—perpetrator unidentified";
        theories  = ["psychodynamic", "rational_choice", "labeling"];
        quotes    = [
          "I like killing people because it is so much fun.",
          "I shall not give you my name because you will try to slow down or stop my collecting of slaves."
        ];
        summary   = "The Zodiac Killer was an unidentified serial killer who operated in Northern California in the late 1960s and early 1970s, claiming responsibility for at least five confirmed murders. The case remains one of the most studied in criminal investigative history due to its encrypted communications and the unresolved perpetrator identity, offering a paradigmatic study in investigative failure and offender taunting behavior.";
        severity  = 9;
        notoriety = 10;
      },
    ];
    for (c in samples.vals()) {
      store.add(c);
    };
  };

  public func listAll(store : CaseStore) : [Types.Case] {
    store.toArray();
  };

  public func getById(store : CaseStore, id : Common.CaseId) : ?Types.Case {
    store.find(func(c) { c.id == id });
  };

  public func search(
    store       : CaseStore,
    name        : ?Text,
    category    : ?Text,
    yearFrom    : ?Nat,
    yearTo      : ?Nat,
    minSeverity : ?Nat,
  ) : [Types.Case] {
    store.filter(func(c) {
      let nameMatch = switch name {
        case null true;
        case (?n)  c.name.toLower().contains(#text (n.toLower())) or
                   c.alias.toLower().contains(#text (n.toLower()));
      };
      let catMatch = switch category {
        case null    true;
        case (?cat)  c.category.toLower().contains(#text (cat.toLower()));
      };
      let yearFromMatch = switch yearFrom {
        case null     true;
        case (?yf)    c.year >= yf;
      };
      let yearToMatch = switch yearTo {
        case null     true;
        case (?yt)    c.year <= yt;
      };
      let severityMatch = switch minSeverity {
        case null    true;
        case (?ms)   c.severity >= ms;
      };
      nameMatch and catMatch and yearFromMatch and yearToMatch and severityMatch;
    }).toArray();
  };
};
