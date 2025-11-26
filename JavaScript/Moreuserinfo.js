//<nowiki>
(function() {
    if (mw.config.get("wgNamespaceNumber") !== 2 && mw.config.get("wgNamespaceNumber") !== 3) return;

    const username = mw.config.get("wgTitle").split("/")[0];
    if (!username) return;

    const icons = {
        bureaucrat: { m: "Icone wikipedia bureaucrat m.svg", f: "Icone wikipedia bureaucrat f.svg", n: "Icone wikipedia bureaucrat n.svg" },
        sysop: { m: "Icone wikipedia admin m.svg", f: "Icone wikipedia admin f.svg", n: "Icone wikipedia admin n.svg" },
        patroller: { m: "Icone wikipedia RC patrol m.svg", f: "Icone wikipedia RC patrol f.svg", n: "Icone wikipedia RC patrol n.svg" },
        autopatrol: { m: "Icone wikipedia validated m.svg", f: "Icone wikipedia validated f.svg", n: "Icone wikipedia validated n.svg" },
        bot: { m: "Logo wikibot.svg", f: "Logo wikibot.svg", n: "Logo wikibot.svg" },
        blocked: { m: "Icone wikipedia blocked m 01.svg", f: "Icone wikipedia blocked f 01.svg", n: "Icone wikipedia blocked n.svg" },
        none: { m: "Icone wikipedia register m.svg", f: "Icone wikipedia register f.svg", n: "Icone wikipedia register n.svg" }
    };

    const labels = {
        bureaucrat: { m: "bureaucrate", f: "bureaucrate", n: "bureaucrate" },
        sysop: { m: "administrateur", f: "administratrice", n: "administrateur·rice" },
        patroller: { m: "patrouilleur", f: "patrouilleuse", n: "patrouilleur·euse" },
        autopatrol: { m: "autopatrouillé", f: "autopatrouillée", n: "autopatrouillé·e" },
        bot: { m: "robot", f: "robot", n: "robot" },
        blocked: { m: "bloqué", f: "bloquée", n: "bloqué·e" },
        none: { m: "utilisateur", f: "utilisatrice", n: "utilisateur·rice" }
    };

    const order = ["bureaucrat", "sysop", "patroller", "autopatrol", "bot", "blocked", "none"];

    $.getJSON(mw.util.wikiScript('api'), {
        action: "query", list: "users", ususers: username,
        usprop: "groups|gender|registration", format: "json"
    }).done(function(data) {
        const user = data.query.users[0];
        const gender = user.gender === "male" ? "m" : user.gender === "female" ? "f" : "n";
        const groups = user.groups || [];
        const registration = user.registration ? new Date(user.registration) : null;

        let statuses = [];
        if (groups.includes("bureaucrat")) statuses.push("bureaucrat");
        if (groups.includes("sysop")) statuses.push("sysop");
        if (groups.includes("patroller")) statuses.push("patroller");
        if (groups.includes("autopatrol")) statuses.push("autopatrol");
        if (groups.includes("bot")) statuses.push("bot");
        if (groups.includes("blocked")) statuses.push("blocked");
        if (!statuses.length) statuses.push("none");

        let mainStatus = order.find(s => statuses.includes(s));
        let otherStatuses = statuses.filter(s => s !== mainStatus);

        let anciennete = "ancienneté inconnue";
        if (registration) {
            const now = new Date();
            const days = Math.floor((now - registration) / (1000 * 60 * 60 * 24));
            if (days < 7) anciennete = days + " jour" + (days > 1 ? "s" : "");
            else if (days < 30) anciennete = Math.floor(days / 7) + " semaine" + (Math.floor(days / 7) > 1 ? "s" : "");
            else if (days < 365) anciennete = Math.floor(days / 30) + " mois";
            else {
                const years = Math.floor(days / 365);
                const months = Math.floor((days % 365) / 30);
                anciennete = years + " an" + (years > 1 ? "s" : "") + (months ? " et " + months + " mois" : "");
            }
        }

        const statusText = statuses.map(s => labels[s][gender]).join(", ");
        const cetCette = gender === "m" ? "Ce" : gender === "f" ? "Cette" : "Cet";

        const $banner = $(`
            <div style="display:flex; align-items:center; background:#f8f8f8; border:1px solid #ccc;
                        padding:8px; margin-top:8px; font-size:14px;">
                <img src="/wiki/Special:FilePath/${icons[mainStatus][gender]}" 
                     style="width:80px;height:80px;margin-right:12px;">
                <div style="flex:1;">
                    <b>${username}</b> · ${cetCette} <b>${labels[mainStatus][gender]}</b> 
                    (${statusText}) est inscrit${gender === "f" ? "e" : ""} depuis ${anciennete}.
                </div>
                <div style="display:flex; gap:4px;">
                    ${otherStatuses.map(s => `<img src="/wiki/Special:FilePath/${icons[s][gender]}" style="width:30px;height:30px;">`).join("")}
                </div>
            </div>
        `);

        $("#firstHeading").after($banner);
    });
})();
//</nowiki>
