/**
 * Represents the RuneScape HiScore instances.
 *
 * @remarks Every instance has an independent database.
 * @see {@link https://developer.runescape.com/platform/modules/hiscores/instances.html}
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
 * @remarks Every instance has an independent database.
 * @see {@link https://developer.runescape.com/platform/modules/hiscores/instances.html}
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
