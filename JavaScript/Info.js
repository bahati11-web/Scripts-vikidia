// Bandeau infos sur les pages Vikidia
(async function() {
    if (mw.config.get("wgNamespaceNumber") !== 0) return;
    const title = mw.config.get("wgPageName");

    try {
        const pageInfo = await fetch(`https://fr.vikidia.org/w/api.php?action=query&format=json&prop=revisions&rvprop=timestamp|user&rvlimit=1&rvdir=newer&titles=${title}&origin=*`).then(r => r.json());
        const pageId = Object.keys(pageInfo.query.pages)[0];
        const creator = pageInfo.query.pages[pageId]?.revisions?.[0]?.user || "Inconnu";
        const createdDateRaw = pageInfo.query.pages[pageId]?.revisions?.[0]?.timestamp || "";
        const createdDate = createdDateRaw ? new Date(createdDateRaw).toLocaleString("fr-FR", { dateStyle: "long", timeStyle: "short" }) : "Date inconnue";

        const contribData = await fetch(`https://fr.vikidia.org/w/api.php?action=query&format=json&prop=contributors&titles=${title}&pclimit=max&origin=*`).then(r => r.json());
        const contributorsCount = contribData.query.pages[pageId]?.contributors?.length || 0;

        const revData = await fetch(`https://fr.vikidia.org/w/api.php?action=query&format=json&titles=${title}&prop=revisions&rvprop=ids&rvlimit=max&origin=*`).then(r => r.json());
        const revCount = revData.query.pages[pageId]?.revisions?.length || 0;

        const today = new Date();
        const endDate = today.toISOString().split("T")[0].replace(/-/g, "");
        const startDate = new Date(today.setDate(today.getDate() - 30)).toISOString().split("T")[0].replace(/-/g, "");
        const viewsData = await fetch(`https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/fr.vikidia/all-access/all-agents/${encodeURIComponent(title)}/daily/${startDate}/${endDate}`).then(r => r.json());
        const totalViews = viewsData.items ? viewsData.items.reduce((sum, v) => sum + v.views, 0) : 0;

        const bandeau = document.createElement("div");
        bandeau.innerHTML = `Créé par <a href="/wiki/Utilisateur:${creator}" style="color:#6a1b9a;font-weight:bold;">${creator}</a> le ${createdDate} &bull; ${revCount} révisions &bull; ${contributorsCount} contributeurs &bull; ${totalViews} vues (30 jours)`;
        bandeau.style.cssText = `
            background: white;
            border: 2px solid #6a1b9a;
            color: black;
            padding: 8px;
            text-align: center;
            font-size: 14px;
            margin: 10px 0;
            border-radius: 6px;
        `;

        const titleElement = document.querySelector("#firstHeading");
        if (titleElement && titleElement.parentNode) {
            titleElement.insertAdjacentElement("afterend", bandeau);
        }
    } catch (err) {
        console.error("Erreur lors du chargement du bandeau :", err);
    }
})();
