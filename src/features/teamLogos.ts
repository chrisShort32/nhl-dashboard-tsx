export function getTeamLogo(teamCode: string, lightOrDark: "light" | "dark"): string {
     const logoPath = lightOrDark === "dark" ? teamCode + "_dark.svg" : teamCode + ".svg"

     return "src/assets/team_logos/" + logoPath
}