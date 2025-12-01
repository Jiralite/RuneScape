import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import { RuneScapeAPIError, RuneScapeError, RuneScapeErrorCode } from "./utility/error.js";
import { makeRequest } from "./utility/make-request.js";

interface RawProfile {
	magic: number;
	questsstarted: number;
	totalskill: number;
	questscomplete: number;
	questsnotstarted: number;
	totalxp: number;
	ranged: number;
	activities: RawProfileActivity[];
	skillvalues: ProfileSkills[];
	name: string;
	rank: string | null;
	melee: number;
	combatlevel: number;
	loggedIn: `${boolean}`;
}

/**
 * Represents the type of error that may be encountered when fetching a player's RuneMetrics profile.
 *
 * @internal
 */
enum ProfileErrorType {
	NoProfile = "NO_PROFILE",
	NotAMember = "NOT_A_MEMBER",
	ProfilePrivate = "PROFILE_PRIVATE",
}

/**
 * Represents an error returned when fetching a player's RuneMetrics profile.
 *
 * @internal
 */
interface ProfileError {
	error: ProfileErrorType;
	loggedIn: "false";
}

/**
 * Represents the returned RuneMetrics profile activity.
 *
 * @internal
 */
interface RawProfileActivity {
	date: string;
	details: string;
	text: string;
}

/**
 * Represents the RuneMetrics profile activity.
 */
export interface ProfileActivity {
	/**
	 * The timestamp of the activity.
	 */
	timestamp: number;
	/**
	 * The details of the activity.
	 *
	 * @example "I killed 2 tormented demons, fewer tormented souls in the world must be a good thing."
	 */
	details: string;
	/**
	 * The shortened variant of the {@link ProfileActivity.details}.
	 *
	 * @example "I killed 2 tormented demons."
	 */
	text: string;
}

/**
 * Represents the enumeration of skills as returned from the API.
 */
export enum SkillId {
	Attack = 0,
	Defence = 1,
	Strength = 2,
	Constitution = 3,
	Ranged = 4,
	Prayer = 5,
	Magic = 6,
	Cooking = 7,
	Woodcutting = 8,
	Fletching = 9,
	Fishing = 10,
	Firemaking = 11,
	Crafting = 12,
	Smithing = 13,
	Mining = 14,
	Herblore = 15,
	Agility = 16,
	Thieving = 17,
	Slayer = 18,
	Farming = 19,
	Runecrafting = 20,
	Hunter = 21,
	Construction = 22,
	Summoning = 23,
	Dungeoneering = 24,
	Divination = 25,
	Invention = 26,
	Archaeology = 27,
}

/**
 * Represents data about the player's stats as returned from the RuneMetrics profile.
 */
export interface ProfileSkills {
	/**
	 * The level of the skill.
	 */
	level: number;
	/**
	 * The experience of the skill.
	 *
	 * @remarks The experience is accurate to one decimal place.
	 * @example 200000000.0
	 */
	xp: number;
	/**
	 * The rank this skill is in the HiScores.
	 */
	rank: number | undefined;
	/**
	 * The id of this skill.
	 *
	 * @remarks This is the specific number belonging to a skill. The {@link SkillId} enumeration may help here.
	 */
	id: SkillId;
}

/**
 * Represents data about player's RuneMetrics Profile.
 */
export interface Profile {
	/**
	 * It's not known what this represents.
	 *
	 * @experimental
	 */
	magic: RawProfile["magic"];
	/**
	 * The amount of quests the player has started.
	 */
	questsStarted: RawProfile["questsstarted"];
	/**
	 * The total level of the player.
	 */
	totalSkill: RawProfile["totalskill"];
	/**
	 * The amount of quests the player has completed.
	 */
	questsComplete: RawProfile["questscomplete"];
	/**
	 * The amount of quests the player has not started.
	 */
	questsNotStarted: RawProfile["questsnotstarted"];
	/**
	 * The total experience of the player.
	 */
	totalXp: RawProfile["totalxp"];
	/**
	 * It's not known what this represents.
	 *
	 * @experimental
	 */
	ranged: RawProfile["ranged"];
	/**
	 * The activities of the player.
	 *
	 * @remarks This is the event log of the player; formerly known as the Adventurer's Log.
	 */
	activities: ProfileActivity[];
	/**
	 * An array of skill values of the player.
	 *
	 * @remarks This is an array of the player's skills containing various information.
	 */
	skillValues: RawProfile["skillvalues"];
	/**
	 * The name of the player.
	 *
	 * @remarks This returns the correct capitalisation of the player's name.
	 */
	name: RawProfile["name"];
	/**
	 * The rank of the player.
	 *
	 * @remarks When not `null`, this is separated by commas.
	 * @example "8,181"
	 */
	rank: RawProfile["rank"];
	/**
	 * It's not known what this represents.
	 *
	 * @experimental
	 */
	melee: RawProfile["melee"];
	/**
	 * The combat level of the player.
	 */
	combatLevel: RawProfile["combatlevel"];
	/**
	 * Whether the player is signed in to RuneMetrics.
	 *
	 * @remarks Because of how this data is retrieved, this may be assumed to always be `false`.
	 */
	loggedIn: boolean;
}

/**
 * Represents the options to provide for fetching a RuneMetrics profile.
 */
export interface ProfileOptions {
	/**
	 * The player's name.
	 */
	name: string;
	/**
	 * The maximum number of activities to return.
	 *
	 * @remarks 20 is the maximum number this limit abides by.
	 */
	activities?: number | undefined;
	/**
	 * The abort signal for the fetch.
	 */
	abortSignal?: AbortSignal | undefined;
}

dayjs.extend(utc);

/**
 * Returns the player's profile data as viewed on RuneMetrics.
 *
 * @param options - The options to provide
 * @returns The profile of the player as described by RuneMetrics.
 */
export async function profile({ name, activities, abortSignal }: ProfileOptions): Promise<Profile> {
	const urlSearchParams = new URLSearchParams();
	urlSearchParams.set("user", name);

	if (activities !== undefined) {
		urlSearchParams.set("activities", String(activities));
	}

	const url = `https://apps.runescape.com/runemetrics/profile?${urlSearchParams}` as const;
	const response = await makeRequest(url, abortSignal);

	if (!response.ok) {
		throw new RuneScapeAPIError("Error fetching RuneMetrics profile data.", response.status, url);
	}

	const body = (await response.json()) as ProfileError | RawProfile;

	if ("error" in body) {
		let code: RuneScapeErrorCode;

		switch (body.error) {
			case ProfileErrorType.NotAMember:
				code = RuneScapeErrorCode.ProfileNotAMember;
				break;
			case ProfileErrorType.ProfilePrivate:
				code = RuneScapeErrorCode.ProfilePrivate;
				break;
			case ProfileErrorType.NoProfile:
				code = RuneScapeErrorCode.ProfileNone;
				break;
			default:
				code = RuneScapeErrorCode.ProfileError;
		}

		throw new RuneScapeError(code, body.error, url);
	}

	const {
		magic,
		questsstarted,
		totalskill,
		questscomplete,
		questsnotstarted,
		totalxp,
		ranged,
		activities: rawActivities,
		skillvalues,
		name: rawName,
		rank,
		melee,
		combatlevel,
		loggedIn,
	} = body;

	return {
		magic,
		questsStarted: questsstarted,
		totalSkill: totalskill,
		questsComplete: questscomplete,
		questsNotStarted: questsnotstarted,
		totalXp: totalxp,
		ranged,
		activities: rawActivities.map(({ date, details, text }) => ({
			timestamp: dayjs.utc(date, "Europe/London").valueOf(),
			details,
			text,
		})),
		skillValues: skillvalues.map(({ level, xp, rank, id }) => ({
			level,
			xp: xp / 10,
			rank,
			id,
		})),
		name: rawName,
		rank,
		melee,
		combatLevel: combatlevel,
		loggedIn: loggedIn === "true",
	};
}

/**
 * Standardises {@link ProfileActivity.details} or {@link ProfileActivity.text} to ensure consistent formatting.
 *
 * @remarks
 * - Removes extra spaces between words
 * - Lowercases articles (A, An) that appear after double spaces
 * - Formats experience numbers with commas and lowercase (e.g. "124000000XP" to "124,000,000 xp")
 * - Ensures the string ends with a full stop if it doesn't already end with punctuation (., !, ?)
 * @param log - The {@link ProfileActivity.details} or {@link ProfileActivity.text} to standardise
 */
export function standardiseProfileActivityLog(log: string): string {
	// Lowercase articles that appear after double spaces before normalising.
	let result = log.replace(/\s{2,}(A|An)\s/g, (_match, article) => {
		return ` ${article.toLowerCase()} `;
	});

	// Normalise remaining spaces.
	result = result.replace(/\s+/g, " ");

	// Format experience numbers with commas and lowercase (e.g. "124000000XP" to "124,000,000 xp").
	result = result.replace(/(\d+)XP/gi, (_match, number) => {
		const formattedNumber = Number(number).toLocaleString("en-GB");
		return `${formattedNumber} xp`;
	});

	// Format experience numbers before "experience points" (e.g. "100000000 experience points" to "100,000,000 experience points").
	result = result.replace(/(\d+)\s+experience points/gi, (_match, number) => {
		const formattedNumber = Number(number).toLocaleString("en-GB");
		return `${formattedNumber} experience points`;
	});

	// Check if the string already ends with sentence-ending punctuation.
	const endsWithPunctuation = /[.!?]$/.test(result);

	if (endsWithPunctuation) {
		return result;
	}

	return `${result}.`;
}

interface RawQuestDetail {
	loggedIn: `${boolean}`;
	quests: Quest[];
}

/**
 * Represents the difficulty of a quest.
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
	 * The special difficulty.
	 */
	Special = 250,
}

/**
 * Represents the status of a quest.
 */
export enum QuestStatus {
	/**
	 * The status of a quest being completed.
	 */
	Completed = "COMPLETED",
	/**
	 * The status of a quest not being started.
	 */
	NotStarted = "NOT_STARTED",
	/**
	 * The status of a quest being started.
	 */
	Started = "STARTED",
}

/**
 * Represents the title of a quest.
 */
export enum QuestTitle {
	AChristmasReunion = "A Christmas Reunion",
	AClockworkSyringe = "A Clockwork Syringe",
	AFairyTaleIGrowingPains = "A Fairy Tale I - Growing Pains",
	AFairyTaleIICureaQueen = "A Fairy Tale II - Cure a Queen",
	AFairyTaleIIIBattleatOrksRift = "A Fairy Tale III - Battle at Ork's Rift",
	AGuildOfOurOwn = "A Guild of Our Own (miniquest)",
	AShadowoverAshdale = "A Shadow over Ashdale",
	ASoulsBane = "A Soul's Bane",
	ATailOfTwoCats = "A Tail of Two Cats",
	AVoidDance = "A Void Dance",
	Aftermath = "Aftermath",
	AllFiredUp = "All Fired Up",
	AlphaVsOmega = "Alpha vs Omega",
	AncientAwakening = "Ancient Awakening",
	AnimalMagnetism = "Animal Magnetism",
	AnotherSliceOfHAM = "Another Slice of H.A.M.",
	AsaFirstResort = "As a First Resort",
	AzzanadrasQuest = "Azzanadra's Quest",
	BackToMyRoots = "Back to my Roots",
	BackToTheFreezer = "Back to the Freezer",
	BarCrawl = "Bar Crawl (miniquest)",
	BattleOfForinthry = "Battle of Forinthry",
	BattleOfTheMonolith = "Battle of the Monolith",
	BeneathCursedTides = "Beneath Cursed Tides",
	BeneathScabarasSands = "Beneath Scabaras' Sands",
	BenedictsWorldTour = "Benedict's World Tour (miniquest)",
	BetweenARock = "Between a Rock...",
	BigChompyBirdHunting = "Big Chompy Bird Hunting",
	Biohazard = "Biohazard",
	BirthrightOfTheDwarves = "Birthright of the Dwarves",
	BloodRunsDeep = "Blood Runs Deep",
	BoricsTaskI = "Boric's Task I (miniquest)",
	BoricsTaskII = "Boric's Task II (miniquest)",
	BoricsTaskIII = "Boric's Task III (miniquest)",
	BringingHomeTheBacon = "Bringing Home the Bacon",
	BrokenHome = "Broken Home",
	BuyersAndCellars = "Buyers and Cellars",
	CabinFever = "Cabin Fever",
	CallOfTheAncestors = "Call of the Ancestors",
	CarnilleanRising = "Carnillean Rising",
	CatapultConstruction = "Catapult Construction",
	ChefsAssistant = "Chef's Assistant",
	ChildrenOfMah = "Children of Mah",
	CityOfSenntisten = "City of Senntisten",
	CivilWarI = "Civil War I (miniquest)",
	CivilWarII = "Civil War II (miniquest)",
	CivilWarIII = "Civil War III (miniquest)",
	ClockTower = "Clock Tower",
	ColdFront = "Cold Front",
	ColdWar = "Cold War",
	Contact = "Contact!",
	CooksAssistant = "Cook's Assistant",
	CreatureOfFenkenstrain = "Creature of Fenkenstrain",
	CrocodileTears = "Crocodile Tears",
	CurseOfTheBlackStone = "Curse of the Black Stone",
	DamageControl = "Damage Control (miniquest)",
	DaughterOfChaos = "Daughter of Chaos",
	DeadAndBuried = "Dead and Buried",
	DeadliestCatch = "Deadliest Catch",
	DealingwithScabaras = "Dealing with Scabaras",
	DeathPlateau = "Death Plateau",
	DeathToTheDorgeshuun = "Death to the Dorgeshuun",
	DefenderOfVarrock = "Defender of Varrock",
	DemonSlayer = "Demon Slayer",
	DesertSlayerDungeon = "Desert Slayer Dungeon (miniquest)",
	DesertTreasure = "Desert Treasure",
	DesperateCreatures = "Desperate Creatures",
	DesperateMeasures = "Desperate Measures",
	DesperateTimes = "Desperate Times",
	DeviousMinds = "Devious Minds",
	DiamondInTheRough = "Diamond in the Rough",
	DimensionOfDisaster = "Dimension of Disaster",
	DimensionOfDisasterCoinOfTheRealm = "Dimension of Disaster: Coin of the Realm",
	DimensionOfDisasterCurseOfArrav = "Dimension of Disaster: Curse of Arrav",
	DimensionOfDisasterDefenderOfVarrock = "Dimension of Disaster: Defender of Varrock",
	DimensionOfDisasterDemonSlayer = "Dimension of Disaster: Demon Slayer",
	DimensionOfDisasterShieldOfArrav = "Dimension of Disaster: Shield of Arrav",
	DishonourAmongThieves = "Dishonour among Thieves",
	DoNoEvil = "Do No Evil",
	DoricsTaskI = "Doric's Task I (miniquest)",
	DoricsTaskII = "Doric's Task II (miniquest)",
	DoricsTaskIII = "Doric's Task III (miniquest)",
	DoricsTaskIV = "Doric's Task IV (miniquest)",
	DoricsTaskV = "Doric's Task V (miniquest)",
	DoricsTaskVI = "Doric's Task VI (miniquest)",
	DoricsTaskVII = "Doric's Task VII (miniquest)",
	DoricsTaskVIII = "Doric's Task VIII (miniquest)",
	DragonSlayer = "Dragon Slayer",
	DreamMentor = "Dream Mentor",
	DruidicRitual = "Druidic Ritual",
	DuckQuest = "Duck Quest",
	DwarfCannon = "Dwarf Cannon",
	EadgarsRuse = "Eadgar's Ruse",
	EaglesPeak = "Eagles' Peak",
	EclipseOfTheHeart = "Eclipse of the Heart",
	ElementalWorkshopI = "Elemental Workshop I",
	ElementalWorkshopII = "Elemental Workshop II",
	ElementalWorkshopIII = "Elemental Workshop III",
	ElementalWorkshopIV = "Elemental Workshop IV",
	EnakhrasLament = "Enakhra's Lament",
	EnlightenedJourney = "Enlightened Journey",
	EnterTheAbyss = "Enter the Abyss (miniquest)",
	ErnestTheChicken = "Ernest the Chicken",
	EvilDavesBigDayOut = "Evil Dave's Big Day Out",
	Extinction = "Extinction",
	EyeForAnEye = "Eye for an Eye (miniquest)",
	EyeOfHetI = "Eye of Het I",
	EyeOfHetII = "Eye of Het II",
	FamilyCrest = "Family Crest",
	FateOfTheGods = "Fate of the Gods",
	FatherAndSon = "Father and Son",
	FieldOfScreams = "Field of Screams",
	FightArena = "Fight Arena",
	FinalDestination = "Final Destination (miniquest)",
	Finale = "Finale",
	FishingContest = "Fishing Contest",
	FlagFall = "Flag Fall (miniquest)",
	Flashback = "Flashback",
	Foreshadowing = "Foreshadowing",
	ForgettableTaleOfADrunkenDwarf = "Forgettable Tale of a Drunken Dwarf",
	ForgivenessOfAChaosDwarf = "Forgiveness of a Chaos Dwarf",
	Fortunes = "Fortunes",
	FromTinyAcorns = "From Tiny Acorns (miniquest)",
	FurNSeek = "Fur 'n Seek",
	GardenOfTranquillity = "Garden of Tranquillity",
	GertrudesCat = "Gertrude's Cat",
	GhostsAhoy = "Ghosts Ahoy",
	GhostsfromThePast = "Ghosts from the Past (miniquest)",
	GloriousMemories = "Glorious Memories",
	GoblinDiplomacy = "Goblin Diplomacy",
	GowerQuest = "Gower Quest",
	GreatEggSpectations = "Great Egg-spectations",
	GrimTales = "Grim Tales",
	GunnarsGround = "Gunnar's Ground",
	GuysAndDolls = "Guys and Dolls",
	Harbinger = "Harbinger (miniquest)",
	HauntedMine = "Haunted Mine",
	HazeelCult = "Hazeel Cult",
	HeadOfTheFamily = "Head of the Family (miniquest)",
	HeartOfStone = "Heart of Stone",
	Heartstealer = "Heartstealer",
	HelpingLaniakea = "Helping Laniakea",
	HeroesQuest = "Heroes' Quest",
	HerosWelcome = "Hero's Welcome",
	HolyGrail = "Holy Grail",
	HopespearsWill = "Hopespear's Will (miniquest)",
	HorrorfromTheDeep = "Horror from the Deep",
	HousingOfParliament = "Housing of Parliament",
	HuntforRedRaktuber = "Hunt for Red Raktuber",
	IcthlarinsLittleHelper = "Icthlarin's Little Helper",
	ImpCatcher = "Imp Catcher",
	ImpressingTheLocals = "Impressing the Locals",
	InAidOfTheMyreque = "In Aid of the Myreque",
	InMemoryOfTheMyreque = "In Memory of the Myreque (miniquest)",
	InPyreNeed = "In Pyre Need",
	InSearchOfTheMyreque = "In Search of the Myreque",
	ItsSnowBother = "It's Snow Bother",
	JedHunter = "Jed Hunter (miniquest)",
	JunglePotion = "Jungle Potion",
	KennithsConcerns = "Kennith's Concerns",
	KiliRow = "Kili Row",
	KindredSpirits = "Kindred Spirits",
	KingOfTheDwarves = "King of the Dwarves",
	KingsRansom = "King's Ransom",
	KoscheisTroubles = "Koschei's Troubles (miniquest)",
	LairOfTarnRazorlor = "Lair of Tarn Razorlor (miniquest)",
	LandOfTheGoblins = "Land of the Goblins",
	LegacyOfSeergaze = "Legacy of Seergaze",
	LegendsQuest = "Legends' Quest",
	LetThemEatPie = "Let Them Eat Pie",
	LostCity = "Lost City",
	LostHerMarbles = "Lost Her Marbles (miniquest)",
	LoveStory = "Love Story",
	LunarDiplomacy = "Lunar Diplomacy",
	MahjarratMemories = "Mahjarrat Memories (miniquest)",
	MakingHistory = "Making History",
	MeetingHistory = "Meeting History",
	MerlinsCrystal = "Merlin's Crystal",
	MissingMyMummy = "Missing My Mummy",
	MissingPresumedDeath = "Missing, Presumed Death",
	MonkeyMadness = "Monkey Madness",
	MonksFriend = "Monk's Friend",
	MountainDaughter = "Mountain Daughter",
	MourningsEndPartI = "Mourning's End Part I",
	MourningsEndPartII = "Mourning's End Part II",
	MurderMystery = "Murder Mystery",
	MurderOnTheBorder = "Murder on the Border",
	MyArmsBigAdventure = "My Arm's Big Adventure",
	MythsOfTheWhiteLands = "Myths of the White Lands",
	Nadir = "Nadir (saga)",
	NatureSpirit = "Nature Spirit",
	Necromancy = "Necromancy!",
	NewFoundations = "New Foundations",
	NomadsElegy = "Nomad's Elegy",
	NomadsRequiem = "Nomad's Requiem",
	ObservatoryQuest = "Observatory Quest",
	OdeofTheDevourer = "Ode of the Devourer",
	OlafsQuest = "Olaf's Quest",
	OnceUponaSlime = "Once Upon a Slime",
	OnceUponaTimeInGielinor = "Once Upon a Time in Gielinor",
	OneFootInTheGrave = "One Foot in the Grave (miniquest)",
	OneOfAKind = "One of a Kind",
	OnePiercingNote = "One Piercing Note",
	OneSmallFavour = "One Small Favour",
	OsseousRex = "Osseous Rex",
	OurManInTheNorth = "Our Man in the North",
	PerilsOfIceMountain = "Perils of Ice Mountain",
	PharaohsFolly = "Pharaoh's Folly",
	PhiteClub = "'Phite Club",
	PiecesOfHate = "Pieces of Hate",
	PiratesTreasure = "Pirate's Treasure",
	PlagueCity = "Plague City",
	PlaguesEnd = "Plague's End",
	PriestInPeril = "Priest in Peril",
	PurpleCat = "Purple Cat (miniquest)",
	QuietBeforeTheSwarm = "Quiet Before the Swarm",
	RagAndBoneMan = "Rag and Bone Man",
	RakshaTheShadowColossus = "Raksha, the Shadow Colossus",
	RatCatchers = "Rat Catchers",
	RebuildingEdgeville = "Rebuilding Edgeville (miniquest)",
	RecipeforDisaster = "Recipe for Disaster",
	RecipeforDisasterAnotherCooksQuest = "Recipe for Disaster: Another Cook's Quest",
	RecipeforDisasterDefeatingTheCulinaromancer = "Recipe for Disaster: Defeating the Culinaromancer",
	RecipeforDisasterFreeingEvilDave = "Recipe for Disaster: Freeing Evil Dave",
	RecipeforDisasterFreeingKingAwowogei = "Recipe for Disaster: Freeing King Awowogei",
	RecipeforDisasterFreeingPiratePete = "Recipe for Disaster: Freeing Pirate Pete",
	RecipeforDisasterFreeingSirAmikVarze = "Recipe for Disaster: Freeing Sir Amik Varze",
	RecipeforDisasterFreeingSkrachUglogwee = "Recipe for Disaster: Freeing Skrach Uglogwee",
	RecipeforDisasterFreeingTheGoblinGenerals = "Recipe for Disaster: Freeing the Goblin Generals",
	RecipeforDisasterFreeingTheLumbridgeSage = "Recipe for Disaster: Freeing the Lumbridge Sage",
	RecipeforDisasterFreeingTheMountainDwarf = "Recipe for Disaster: Freeing the Mountain Dwarf",
	RecruitmentDrive = "Recruitment Drive",
	Regicide = "Regicide",
	RemainsOfTheNecrolord = "Remains of the Necrolord",
	RequiemForADragon = "Requiem for a Dragon",
	RitualOfTheMahjarrat = "Ritual of the Mahjarrat",
	RiverOfBlood = "River of Blood",
	RockingOut = "Rocking Out",
	RovingElves = "Roving Elves",
	RoyalTrouble = "Royal Trouble",
	RumDeal = "Rum Deal",
	RuneMechanics = "Rune Mechanics",
	RuneMemories = "Rune Memories",
	RuneMysteries = "Rune Mysteries",
	RuneMythos = "Rune Mythos",
	SaltInTheWound = "Salt in the Wound",
	ScorpionCatcher = "Scorpion Catcher",
	SeaSlug = "Sea Slug",
	ShadesOfMortton = "Shades of Mort'ton",
	ShadowOfTheStorm = "Shadow of the Storm",
	SheepHerder = "Sheep Herder",
	SheepShearer = "Sheep Shearer (miniquest)",
	ShieldOfArrav = "Shield of Arrav",
	ShiloVillage = "Shilo Village",
	SinsOfTheFather = "Sins of the Father (miniquest)",
	SliskesEndgame = "Sliske's Endgame",
	SmokingKills = "Smoking Kills",
	SomeLikeItCold = "Some Like It Cold",
	SongfromTheDepths = "Song from the Depths",
	SoulSearching = "Soul Searching",
	SpiritOfSummer = "Spirit of Summer",
	SpiritsOfTheElid = "Spirits of the Elid",
	SpiritualEnlightenment = "Spiritual Enlightenment (miniquest)",
	StellarBorn = "Stellar Born",
	StolenHearts = "Stolen Hearts",
	Succession = "Succession",
	SummersEnd = "Summer's End",
	SwanSong = "Swan Song",
	SweptAway = "Swept Away",
	TaiBwoWannaiTrio = "Tai Bwo Wannai Trio",
	TalesOfNomad = "Tales of Nomad (miniquest)",
	TalesOfTheGodWars = "Tales of the God Wars (miniquest)",
	TearsOfGuthix = "Tears of Guthix",
	TempleOfIkov = "Temple of Ikov",
	ThatOldBlackMagic = "That Old Black Magic",
	TheBloodPact = "The Blood Pact",
	TheBranchesOfDarkmeyer = "The Branches of Darkmeyer",
	TheBrinkOfExtinction = "The Brink of Extinction",
	TheChosenCommander = "The Chosen Commander",
	TheCurseOfArrav = "The Curse of Arrav",
	TheCurseOfZaros = "The Curse of Zaros (miniquest)",
	TheDarknessOfHallowvale = "The Darkness of Hallowvale",
	TheDeathOfChivalry = "The Death of Chivalry",
	TheDigSite = "The Dig Site",
	TheElderKiln = "The Elder Kiln",
	TheEyesOfGlouphrie = "The Eyes of Glouphrie",
	TheFeud = "The Feud",
	TheFiremakersCurse = "The Firemaker's Curse",
	TheFremennikIsles = "The Fremennik Isles",
	TheFremennikTrials = "The Fremennik Trials",
	TheGeneralsShadow = "The General's Shadow (miniquest)",
	TheGiantDwarf = "The Giant Dwarf",
	TheGolem = "The Golem",
	TheGrandTree = "The Grand Tree",
	TheGreatBrainRobbery = "The Great Brain Robbery",
	TheHandInTheSand = "The Hand in the Sand",
	TheHuntforSurok = "The Hunt for Surok (miniquest)",
	TheJackOfSpades = "The Jack of Spades",
	TheKnightsSword = "The Knight's Sword",
	TheLightWithin = "The Light Within",
	TheLordOfVampyrium = "The Lord of Vampyrium",
	TheLostToys = "The Lost Toys (miniquest)",
	TheLostTribe = "The Lost Tribe",
	TheMightyFall = "The Mighty Fall",
	TheNeedleSkips = "The Needle Skips",
	ThePathOfGlouphrie = "The Path of Glouphrie",
	ThePrisonerOfGlouphrie = "The Prisoner of Glouphrie",
	TheRestlessGhost = "The Restless Ghost",
	TheSlugMenace = "The Slug Menace",
	TheSpiritOfWar = "The Spirit of War",
	TheTaleOfTheMuspah = "The Tale of the Muspah",
	TheTempleatSenntisten = "The Temple at Senntisten",
	TheTouristTrap = "The Tourist Trap",
	TheVaultOfShadows = "The Vault of Shadows",
	TheVoidStaresBack = "The Void Stares Back",
	TheWorldWakes = "The World Wakes",
	ThokItToEm = "Thok It To 'Em (saga)",
	ThokYourBlockOff = "Thok Your Block Off (saga)",
	ThreesCompany = "Three's Company (saga)",
	ThroneOfMiscellania = "Throne of Miscellania",
	TokTzKetDill = "TokTz-Ket-Dill",
	TomesOfTheWarlock = "Tomes of the Warlock",
	TortleCombat = "Tortle Combat (miniquest)",
	TowerOfLife = "Tower of Life",
	TreeGnomeVillage = "Tree Gnome Village",
	TribalTotem = "Tribal Totem",
	TrollRomance = "Troll Romance",
	TrollStronghold = "Troll Stronghold",
	TuaiLeitsOwn = "Tuai Leit's Own (miniquest)",
	TwilightOfTheGods = "Twilight of the Gods",
	UndergroundPass = "Underground Pass",
	UnstableFoundations = "Unstable Foundations",
	UnwelcomeGuests = "Unwelcome Guests",
	VampyreSlayer = "Vampyre Slayer",
	Vengeance = "Vengeance (saga)",
	VesselOfTheHarbinger = "Vessel of the Harbinger",
	VioletisBlue = "Violet is Blue",
	VioletisBlueToo = "Violet is Blue Too",
	WanderingGaal = "Wandering Ga'al (miniquest)",
	Wanted = "Wanted!",
	Watchtower = "Watchtower",
	WaterfallQuest = "Waterfall Quest",
	WhatLiesBelow = "What Lies Below",
	WhatsMineisYours = "What's Mine is Yours",
	WhileGuthixSleeps = "While Guthix Sleeps",
	WitchsHouse = "Witch's House",
	WitchsPotion = "Witch's Potion (miniquest)",
	WithinTheLight = "Within the Light",
	WolfWhistle = "Wolf Whistle",
	YouAreIt = "You Are It",
	ZogreFleshEaters = "Zogre Flesh Eaters",
}

/**
 * Represents the data of a quest.
 */
export interface Quest {
	/**
	 * The difficulty of the quest.
	 */
	difficulty: QuestDifficulty;
	/**
	 * Whether the quest requires membership.
	 */
	members: boolean;
	/**
	 * The amount of quest points the quest rewards.
	 */
	questPoints: number;
	/**
	 * The status of the quest.
	 */
	status: QuestStatus;
	/**
	 * The title of the quest.
	 */
	title: QuestTitle;
	/**
	 * Whether the player is eligible to start the quest.
	 */
	userEligible: boolean;
}

/**
 * Represents data about a player's returned quests.
 */
export interface QuestDetails {
	/**
	 * Whether the player is signed in to RuneMetrics.
	 *
	 * @remarks Because of how this data is retrieved, this may be assumed to always be `false`.
	 */
	loggedIn: boolean;
	/**
	 * An array of quests with respect to the player.
	 */
	quests: Quest[];
}

/**
 * Represents the options to provide for fetching a player's quest data.
 */
export interface QuestDetailsOptions {
	/**
	 * The player's name.
	 */
	name: string;
	/**
	 * The abort signal for the fetch.
	 */
	abortSignal?: AbortSignal;
}

/**
 * Returns the player's quest data.
 *
 * @param options - The options to provide
 * @returns An object containing the quest data.
 */
export async function questDetails({
	name,
	abortSignal,
}: QuestDetailsOptions): Promise<QuestDetails> {
	const urlSearchParams = new URLSearchParams();
	urlSearchParams.set("user", name);
	const url = `https://apps.runescape.com/runemetrics/quests?${urlSearchParams}` as const;
	const response = await makeRequest(url, abortSignal);

	if (!response.ok) {
		throw new RuneScapeAPIError("Error fetching quest data.", response.status, url);
	}

	const body = (await response.json()) as RawQuestDetail;
	const { quests, loggedIn } = body;

	return {
		quests,
		loggedIn: loggedIn === "true",
	};
}
