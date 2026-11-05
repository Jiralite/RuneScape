import { adventurersLogRequest } from "../utility/adventurers-log-request.js";

interface RawPlayerQuests {
	name: string;
	qp: number;
	qp_max: number;
	quests: Readonly<Record<QuestId, Quest>>;
}

/**
 * Represents the difficulty of a quest.
 *
 * @see {@link https://developer.runescape.com/platform/modules/adventurers-log/player-quests.html#difficulty-values}
 */
export enum QuestDifficulty {
	/**
	 * The novice difficulty.
	 */
	Novice = 0,
	/**
	 * The intermediate difficulty.
	 */
	Intermediate = 1,
	/**
	 * The experienced difficulty.
	 */
	Experienced = 2,
	/**
	 * The master difficulty.
	 */
	Master = 3,
	/**
	 * The grandmaster difficulty.
	 */
	Grandmaster = 4,
	/**
	 * The multi difficulty.
	 *
	 * @remarks This seems to still be in use, despite the documentation stating "currently not used".
	 */
	Multi = 250,
}

/**
 * Represents the status of a quest.
 *
 * @see {@link https://developer.runescape.com/platform/modules/adventurers-log/player-quests.html#quest-object}
 */
export enum QuestStatus {
	/**
	 * The status of a quest not being started.
	 */
	NotStarted = "NOT_STARTED",
	/**
	 * The status of a quest being started.
	 */
	Started = "STARTED",
	/**
	 * The status of a quest being completed.
	 */
	Completed = "COMPLETED",
}

/**
 * Represents the internal ids of quests.
 *
 * @see {@link https://developer.runescape.com/platform/modules/adventurers-log/player-quests.html#top-level-response}
 */
export enum QuestId {
	TowerOfLife = 1,
	RockingOut = 4,
	DeathToTheDorgeshuun = 13,
	ErnestTheChicken = 15,
	Watchtower = 16,
	TheTaleOfTheMuspah = 18,
	SweptAway = 20,
	InAidOfTheMyreque = 21,
	CatapultConstruction = 23,
	LunarDiplomacy = 24,
	TheRestlessGhost = 27,
	MurderMystery = 28,
	AllFiredUp = 29,
	RecipeforDisaster = 30,
	FurNSeek = 33,
	DwarfCannon = 34,
	ForgivenessOfAChaosDwarf = 35,
	ASoulsBane = 36,
	TheLostTribe = 37,
	SheepHerder = 39,
	TribalTotem = 40,
	AnimalMagnetism = 43,
	ClockTower = 44,
	ATailOfTwoCats = 45,
	SpiritsOfTheElid = 46,
	DemonSlayer = 51,
	DefenderOfVarrock = 56,
	PlagueCity = 58,
	JunglePotion = 59,
	PiratesTreasure = 60,
	KingsRansom = 61,
	RecruitmentDrive = 62,
	ShieldOfArrav = 63,
	DragonSlayer = 66,
	RagAndBoneMan = 68,
	ShiloVillage = 70,
	ShadowOfTheStorm = 71,
	ImpCatcher = 72,
	MythsOfTheWhiteLands = 74,
	EadgarsRuse = 75,
	FishingContest = 76,
	MissingMyMummy = 77,
	DreamMentor = 79,
	TearsOfGuthix = 81,
	GhostsAhoy = 82,
	AVoidDance = 83,
	TrollStronghold = 85,
	WhileGuthixSleeps = 86,
	InPyreNeed = 87,
	TrollRomance = 90,
	CreatureOfFenkenstrain = 92,
	WaterfallQuest = 93,
	SummersEnd = 95,
	EnakhrasLament = 97,
	RumDeal = 101,
	BigChompyBirdHunting = 102,
	ZogreFleshEaters = 104,
	MerlinsCrystal = 108,
	RovingElves = 110,
	DruidicRitual = 111,
	HolyGrail = 112,
	TheChosenCommander = 114,
	GloriousMemories = 115,
	FamilyCrest = 116,
	TheCurseOfArrav = 117,
	HauntedMine = 120,
	SeaSlug = 121,
	DeviousMinds = 123,
	MakingHistory = 124,
	HazeelCult = 125,
	TempleOfIkov = 126,
	RoyalTrouble = 127,
	Biohazard = 128,
	MonkeyMadness = 130,
	UnstableFoundations = 131,
	NatureSpirit = 133,
	DesertTreasure = 135,
	GoblinDiplomacy = 137,
	GertrudesCat = 138,
	DeathPlateau = 140,
	MeetingHistory = 142,
	WhatLiesBelow = 144,
	ColdWar = 145,
	OneSmallFavour = 146,
	TheFremennikIsles = 148,
	EaglesPeak = 149,
	MountainDaughter = 151,
	AnotherSliceOfHAM = 155,
	WithinTheLight = 167,
	NomadsRequiem = 170,
	RuneMechanics = 171,
	SheepShearer = 173,
	WitchsPotion = 178,
	KingOfTheDwarves = 185,
	ThePrisonerOfGlouphrie = 186,
	AClockworkSyringe = 188,
	RitualOfTheMahjarrat = 194,
	OnePiercingNote = 196,
	SomeLikeItCold = 204,
	BirthrightOfTheDwarves = 215,
	PlaguesEnd = 222,
	HeartOfStone = 224,
	CooksAssistant = 257,
	VampyreSlayer = 258,
	TheKnightsSword = 261,
	LostCity = 262,
	WitchsHouse = 263,
	HeroesQuest = 264,
	ScorpionCatcher = 265,
	MonksFriend = 266,
	TreeGnomeVillage = 267,
	FightArena = 268,
	TheGrandTree = 269,
	UndergroundPass = 270,
	ObservatoryQuest = 271,
	TheTouristTrap = 272,
	TheDigSite = 273,
	LegendsQuest = 274,
	ElementalWorkshopI = 275,
	PriestInPeril = 276,
	TaiBwoWannaiTrio = 277,
	Regicide = 278,
	ShadesOfMortton = 279,
	TheFremennikTrials = 280,
	HorrorfromTheDeep = 281,
	ThroneOfMiscellania = 282,
	InSearchOfTheMyreque = 283,
	BetweenARock = 284,
	TheFeud = 285,
	TheGolem = 286,
	IcthlarinsLittleHelper = 287,
	TheGiantDwarf = 288,
	MourningsEndPartI = 289,
	ForgettableTaleOfADrunkenDwarf = 290,
	GardenOfTranquillity = 291,
	Wanted = 292,
	MourningsEndPartII = 293,
	RatCatchers = 294,
	TheHandInTheSand = 295,
	CabinFever = 296,
	AFairyTaleIGrowingPains = 297,
	RecipeforDisasterAnotherCooksQuest = 298,
	RecipeforDisasterFreeingTheMountainDwarf = 299,
	RecipeforDisasterFreeingTheGoblinGenerals = 300,
	RecipeforDisasterFreeingPiratePete = 301,
	RecipeforDisasterFreeingTheLumbridgeSage = 302,
	RecipeforDisasterFreeingEvilDave = 303,
	RecipeforDisasterFreeingSkrachUglogwee = 304,
	RecipeforDisasterFreeingSirAmikVarze = 305,
	RecipeforDisasterFreeingKingAwowogei = 306,
	RecipeforDisasterDefeatingTheCulinaromancer = 307,
	SwanSong = 308,
	AFairyTaleIICureaQueen = 309,
	TheEyesOfGlouphrie = 310,
	TheDarknessOfHallowvale = 311,
	TheSlugMenace = 312,
	ElementalWorkshopII = 313,
	MyArmsBigAdventure = 314,
	EnlightenedJourney = 315,
	Contact = 316,
	TheGreatBrainRobbery = 317,
	OlafsQuest = 318,
	GrimTales = 319,
	ThePathOfGlouphrie = 320,
	BackToMyRoots = 321,
	LandOfTheGoblins = 322,
	DealingwithScabaras = 323,
	WolfWhistle = 324,
	AsaFirstResort = 325,
	KennithsConcerns = 326,
	LegacyOfSeergaze = 327,
	PerilsOfIceMountain = 328,
	TokTzKetDill = 329,
	SmokingKills = 330,
	SpiritOfSummer = 331,
	HuntforRedRaktuber = 332,
	TheTempleatSenntisten = 333,
	BloodRunsDeep = 334,
	TheBloodPact = 335,
	BuyersAndCellars = 336,
	AFairyTaleIIIBattleatOrksRift = 337,
	ElementalWorkshopIII = 338,
	QuietBeforeTheSwarm = 339,
	LoveStory = 340,
	GunnarsGround = 341,
	TheVoidStaresBack = 342,
	DoNoEvil = 343,
	ElementalWorkshopIV = 344,
	DeadliestCatch = 345,
	SaltInTheWound = 346,
	TheBranchesOfDarkmeyer = 347,
	TheFiremakersCurse = 349,
	LetThemEatPie = 350,
	TheElderKiln = 351,
	SongfromTheDepths = 352,
	CarnilleanRising = 353,
	StolenHearts = 355,
	DiamondInTheRough = 356,
	WhatsMineisYours = 357,
	RuneMysteries = 358,
	RuneMemories = 359,
	TheBrinkOfExtinction = 360,
	TheWorldWakes = 361,
	BringingHomeTheBacon = 362,
	TheDeathOfChivalry = 363,
	MissingPresumedDeath = 364,
	OneOfAKind = 365,
	FateOfTheGods = 366,
	AShadowoverAshdale = 367,
	TheMightyFall = 368,
	BrokenHome = 369,
	DishonourAmongThieves = 370,
	DimensionOfDisaster = 371,
	DimensionOfDisasterCoinOfTheRealm = 372,
	DimensionOfDisasterShieldOfArrav = 373,
	DimensionOfDisasterDemonSlayer = 374,
	DimensionOfDisasterDefenderOfVarrock = 375,
	DimensionOfDisasterCurseOfArrav = 376,
	HerosWelcome = 377,
	TheLightWithin = 378,
	TheLordOfVampyrium = 379,
	CallOfTheAncestors = 380,
	BeneathCursedTides = 381,
	NomadsElegy = 382,
	RiverOfBlood = 383,
	KindredSpirits = 384,
	GowerQuest = 385,
	ChildrenOfMah = 386,
	ImpressingTheLocals = 387,
	SliskesEndgame = 388,
	BackToTheFreezer = 389,
	TheJackOfSpades = 390,
	CrocodileTears = 391,
	OurManInTheNorth = 392,
	PhiteClub = 393,
	EvilDavesBigDayOut = 395,
	PiecesOfHate = 397,
	YouAreIt = 398,
	TheNeedleSkips = 399,
	VioletisBlue = 400,
	ChefsAssistant = 401,
	CurseOfTheBlackStone = 402,
	BarCrawl = 403,
	EnterTheAbyss = 404,
	CurseOfTheEmptyLord = 405,
	LairOfTarnRazorlor = 406,
	TheGeneralsShadow = 407,
	TheHuntforSurok = 408,
	OneFootInTheGrave = 409,
	HopespearsWill = 410,
	DesertSlayerDungeon = 411,
	PurpleCat = 412,
	FromTinyAcorns = 413,
	LostHerMarbles = 414,
	AGuildOfOurOwn = 415,
	ThreesCompany = 416,
	Vengeance = 417,
	ThokItToEm = 418,
	Nadir = 419,
	ThokYourBlockOff = 420,
	DoricsTaskI = 421,
	DoricsTaskII = 422,
	DoricsTaskIII = 423,
	DoricsTaskIV = 424,
	DoricsTaskV = 425,
	DoricsTaskVI = 426,
	DoricsTaskVII = 427,
	DoricsTaskVIII = 428,
	BoricsTaskI = 429,
	BoricsTaskII = 430,
	BoricsTaskIII = 431,
	WanderingGaal = 432,
	KoscheisTroubles = 433,
	MahjarratMemories = 434,
	TalesOfTheGodWars = 435,
	BenedictsWorldTour = 436,
	InMemoryOfTheMyreque = 437,
	TheLostToys = 438,
	TalesOfNomad = 439,
	FlagFall = 440,
	HeadOfTheFamily = 441,
	SpiritualEnlightenment = 442,
	JedHunter = 443,
	EyeForAnEye = 444,
	Harbinger = 445,
	TuaiLeitsOwn = 446,
	GhostsfromThePast = 447,
	DamageControl = 448,
	FinalDestination = 449,
	RebuildingEdgeville = 450,
	VioletisBlueToo = 453,
	OnceUponaSlime = 455,
	DesperateTimes = 460,
	HelpingLaniakea = 461,
	FatherAndSon = 462,
	TortleCombat = 464,
	DesperateMeasures = 465,
	SinsOfTheFather = 466,
	RakshaTheShadowColossus = 467,
	Heartstealer = 468,
	AzzanadrasQuest = 469,
	TheVaultOfShadows = 470,
	Foreshadowing = 471,
	Flashback = 472,
	BattleOfTheMonolith = 473,
	CityOfSenntisten = 474,
	Fortunes = 475,
	Finale = 476,
	OnceUponaTimeInGielinor = 477,
	EyeOfHetI = 478,
	EyeOfHetII = 479,
	Extinction = 480,
	TwilightOfTheGods = 481,
	Aftermath = 482,
	DaughterOfChaos = 483,
	CivilWarI = 484,
	CivilWarII = 485,
	CivilWarIII = 486,
	Succession = 487,
	DesperateCreatures = 488,
	NewFoundations = 489,
	MurderOnTheBorder = 490,
	UnwelcomeGuests = 491,
	DeadAndBuried = 492,
	Necromancy = 493,
	RuneMythos = 494,
	VesselOfTheHarbinger = 495,
	TheSpiritOfWar = 496,
	TomesOfTheWarlock = 497,
	RemainsOfTheNecrolord = 498,
	AlphaVsOmega = 499,
	KiliRow = 500,
	ThatOldBlackMagic = 501,
	AncientAwakening = 502,
	MyOneAndOnlyLute = 503,
	SkellyByEverlight = 504,
	FleshAndBone = 505,
	HermyAndBass = 506,
	BattleOfForinthry = 507,
	ItsSnowBother = 508,
	HousingOfParliament = 509,
	GreatEggSpectations = 510,
	RequiemForADragon = 511,
	OsseousRex = 512,
	SoulSearching = 513,
	OdeofTheDevourer = 514,
	FieldOfScreams = 515,
	AChristmasReunion = 516,
	BeneathScabarasSands = 517,
	PharaohsFolly = 519,
	DuckQuest = 520,
	EclipseOfTheHeart = 521,
	StellarBorn = 522,
	GuysAndDolls = 523,
	ColdFront = 524,
	PrincessAndThePauper = 525,
	VisionsOfHavenhythe = 526,
	HeartsOfSanguine = 527,
	HermitPermits = 528,
	WizKid = 529,
	CorporateEggSpionage = 530,
	SecretsOFAmberfell = 531,
	TheresNoPlaceLikeHome = 532,
	HeraldsOfCrimson = 533,
	AllSoulsEve = 534,
	LearningTheRopes = 535,
}

/**
 * Represents the data of a quest with respect to a player.
 *
 * @see {@link https://developer.runescape.com/platform/modules/adventurers-log/player-quests.html#quest-object}
 */
export interface Quest {
	/**
	 * Name of the quest, subquest or miniquest.
	 */
	title: string;
	/**
	 * Rated difficulty of the quest.
	 */
	difficulty: QuestDifficulty;
	/**
	 * Whether this quest is restricted to RuneScape members.
	 */
	members: boolean;
	/**
	 * How many quest points are awarded if this quest is complete.
	 */
	qp: number;
	/**
	 * Whether this player meets the requirements to do this quest.
	 */
	eligible: boolean;
	/**
	 * The status of the quest.
	 */
	status: QuestStatus;
}

/**
 * Represents a player's quest data.
 *
 * @see {@link https://developer.runescape.com/platform/modules/adventurers-log/player-quests.html#top-level-response}
 */
export interface PlayerQuests {
	/**
	 * Canonical display name for this player.
	 */
	name: string;
	/**
	 * Amount of quest points attained by this player, calculated using the in-game logic.
	 *
	 * @remarks
	 * It might seem like you can calculate a player's quest points by summing the `qp` field for all
	 * quests that are marked with `status: "COMPLETED"`, but this doesn't work in all cases.
	 *
	 * There are a number of special situations, including (but not limited to):
	 *
	 * - Sheep Shearer was downgraded to a miniquest in 2010, but players who completed it before then
	 * kept their 1QP.
	 * - Myths of the White Lands normally awards 2QP, but if you have 1QP from shearing sheep, then the
	 * Myths reward is reduced to 1QP.
	 * - Dimension of Disaster can be replayed. Doing this resets the status to `"STARTED"`, but you
	 * still keep the QP from your initial completion.
	 *
	 * The `qp` field in the top-level response uses the Quest Points value calculated when the player
	 * last logged into the game, so it will mirror the special logic implemented there.
	 * @see {@link https://developer.runescape.com/platform/modules/adventurers-log/player-quests.html#quest-point-calculation}
	 */
	qp: number;
	/**
	 * Maximum amount of quest points that's currently possible to obtain.
	 */
	qpMax: number;
	/**
	 * Map from internal quest ids to quest objects.
	 */
	quests: Readonly<Record<QuestId, Quest>>;
}

/**
 * Represents the options to provide for fetching a player's quest data.
 */
export interface PlayerQuestsOptions {
	/**
	 * The player's name.
	 */
	name: string;
	/**
	 * The abort signal for the fetch.
	 */
	abortSignal?: AbortSignal | undefined;
}

/**
 * Returns the player's quest data.
 *
 * @remarks
 * This data will synchronise to Adventurer's Log when a player logs out, hops worlds, and at
 * semi-regular intervals during gameplay.
 *
 * The Adventurer's Log caches responses, so newly synchronised data may not be returned by the API
 * for up to 10 minutes.
 *
 * This only applies to the main RuneScape game, and not to special game modes like Leagues, or to
 * Old School.
 * @param options - The options to provide
 * @see {@link https://developer.runescape.com/platform/modules/adventurers-log/player-quests.html}
 * @see {@link https://developer.runescape.com/platform/modules/adventurers-log/player-quests.html#update-delays}
 * @see {@link https://developer.runescape.com/platform/modules/adventurers-log/index.html#about-this-module}
 */
export async function playerQuests({
	name,
	abortSignal,
}: PlayerQuestsOptions): Promise<PlayerQuests> {
	const body = await adventurersLogRequest<RawPlayerQuests>(
		"playerQuests",
		name,
		"Error fetching quest data.",
		abortSignal,
	);

	return {
		name: body.name,
		qp: body.qp,
		qpMax: body.qp_max,
		quests: body.quests,
	};
}
