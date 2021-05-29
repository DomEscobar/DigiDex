export function isStrongAgainst(attacker: string, defender: string): boolean {
    const weaknessList = [
        {
            defender: "fire",
            attacker: "water"
        },
        {
            defender: "water",
            attacker: "leaf"
        },
        {
            defender: "leaf",
            attacker: "fire"
        },
        {
            defender: "water",
            attacker: "thunder"
        },
        {
            defender: "thunder",
            attacker: "rock"
        },
        {
            defender: "rock",
            attacker: "psy"
        },
        {
            defender: "psy",
            attacker: "normal"
        },
        {
            defender: "noraml",
            attacker: "rock"
        }
    ];

    return weaknessList.find(o => o.attacker == attacker && o.defender == defender) != undefined;
}