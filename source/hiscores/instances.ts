/**
 * Represents the RuneScape HiScore instances.
 *
 * @remarks
 * Every instance has an independent database.
 *
 * Some of these instances (like Ironman, Skiller, etc.) include a subset of players from the game's
 * main instance. This means that there are situations where a player will stop being eligible to
 * appear in one, such as...
 *
 * - HCIM loses their last life: No longer eligible for Hardcore Ironman hiscores
 * - Skiller gains a level in a combat skill: No longer eligible for Skiller hiscores
 *
 * If this occurs, they will still appear on that instance, but their stats will be frozen at that
 * point. For example, if the skiller makes further gains, those will be reflected on the standard
 * Hiscores but not on the Skiller-specific ones.
 * @see {@link https://developer.runescape.com/platform/modules/hiscores/instances.html}
 * @see {@link https://developer.runescape.com/platform/modules/hiscores/instances.html#eligibility-changes}
 */
export enum HiScoreInstance {
	/**
	 * Standard, Ironman, Hardcore Ironman and Group Ironman players.
	 */
	Standard = "hiscore",
	/**
	 * Ironman and Hardcore Ironman players.
	 */
	Ironman = "hiscore_ironman",
	/**
	 * Hardcore Ironman players.
	 */
	HardcoreIronman = "hiscore_hardcore_ironman",
	/**
	 * Leagues players.
	 */
	Leagues = "hiscore_leagues",
}

/**
 * Represents the Old School RuneScape HiScore instances.
 *
 * @remarks
 * Every instance has an independent database.
 *
 * Some of these instances (like Ironman, Skiller, etc.) include a subset of players from the game's
 * main instance. This means that there are situations where a player will stop being eligible to
 * appear in one, such as...
 *
 * - HCIM loses their last life: No longer eligible for Hardcore Ironman hiscores
 * - Skiller gains a level in a combat skill: No longer eligible for Skiller hiscores
 *
 * If this occurs, they will still appear on that instance, but their stats will be frozen at that
 * point. For example, if the skiller makes further gains, those will be reflected on the standard
 * Hiscores but not on the Skiller-specific ones.
 * @see {@link https://developer.runescape.com/platform/modules/hiscores/instances.html}
 * @see {@link https://developer.runescape.com/platform/modules/hiscores/instances.html#eligibility-changes}
 */
export enum OldSchoolHiScoreInstance {
	/**
	 * Standard, Ironman, Hardcore Ironman, Ultimate Ironman, Group Ironman, Hardcore Group Ironman
	 * and Unranked Group Ironman players.
	 */
	Standard = "hiscore_oldschool",
	/**
	 * Players of {@link OldSchoolHiScoreInstance.Standard} with a Defence level of 1.
	 */
	SkillerDefence = "hiscore_oldschool_skiller_defence",
	/**
	 * Players of {@link OldSchoolHiScoreInstance.SkillerDefence} who also have Attack, Strength,
	 * Ranged, Magic and Prayer levels of 1, and a Hitpoints level of 10.
	 */
	Skiller = "hiscore_oldschool_skiller",
	/**
	 * Ironman, Hardcore Ironman and Ultimate Ironman players.
	 */
	Ironman = "hiscore_oldschool_ironman",
	/**
	 * Hardcore Ironman players.
	 */
	HardcoreIronman = "hiscore_oldschool_hardcore_ironman",
	/**
	 * Ultimate Ironman players.
	 */
	UltimateIronman = "hiscore_oldschool_ultimate",
	/**
	 * Hardcore Worlds players.
	 */
	HardcoreWorlds = "hiscore_oldschool_hardcore_mains",
	/**
	 * Deadman Mode players.
	 */
	DeadmanMode = "hiscore_oldschool_deadman",
	/**
	 * Usually Leagues players. This may be reused for different limited-time game modes.
	 */
	Seasonal = "hiscore_oldschool_seasonal",
	/**
	 * This varies, as it is reused for different limited-time game modes.
	 */
	Tournament = "hiscore_oldschool_tournament",
	/**
	 * Fresh Start Worlds players.
	 */
	FreshStartWorlds = "hiscore_oldschool_fresh_start",
}
