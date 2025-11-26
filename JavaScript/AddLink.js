‎// <nowiki>
‎// Script pour ajouter rapidement un lien interlwiki et des catégories 
‎
‎mw.loader.using(['mediawiki.util', 'mediawiki.api']).then(function () {
‎
‎  // === Options globales ===
‎  window.Interlangues_MinorEdit = true;
‎  window.Interlangues_Watchthis = -1; // -1: nochange, 0: unwatch, 1: watch
‎  window.Interlangues_SkipConfirm = false;
‎
‎  // Fonction d’édition
‎  window.Interlangues_DoEdit = function (Req, data) {
‎    var Text = Req.responseText;
‎    var CodeLangue = data.code;
‎    var TitreLien = data.title;
‎
‎    if (!CodeLangue || !TitreLien) {
‎      alert("Code ou titre manquant.");
‎      return;
‎    }
‎
‎    const LienAAjouter = `[[${CodeLangue}:${TitreLien}]]`;
‎
‎    // Vérification : existe déjà ?
‎    if (Text.includes(LienAAjouter)) {
‎      alert(`Le lien ${LienAAjouter} existe déjà.`);
‎      return;
‎    }
‎
‎    Text = Text.trim() + '\n' + LienAAjouter;
‎
‎    var SommaireFinal = `Ajout du lien interlangue : ${LienAAjouter} ; avec [[Utilisateur:Bahati11/AddLink.js|AddLink.js]]`;
‎    var watchthisparam = { [-1]: "nochange", 0: "unwatch", 1: "watch" };
‎
‎    var datas = {
‎      action: 'edit',
‎      title: mw.config.get('wgPageName'),
‎      text: Text,
‎      summary: SommaireFinal,
‎      minor: Interlangues_MinorEdit ? 1 : 0,
‎      watchlist: watchthisparam[Interlangues_Watchthis],
‎      token: mw.user.tokens.get('csrfToken')
‎    };
‎
‎    var api = new mw.Api();
‎    api.post(datas).then(function () {
‎      location.reload();
‎    }).catch(function (err) {
‎      console.error('Erreur lors de l’édition :', err);
‎      alert('Erreur lors de l’ajout du lien interlangue.');
‎    });
‎  };
‎
‎  // === Bouton esthétique (🌍) inséré à côté du titre ===
‎  if (mw.config.get('wgNamespaceNumber') === 0 && mw.config.get('wgAction') === 'view') {
‎    var $button = $('<a>')
‎      .html('🌍') 
‎      .attr('title', 'Ajouter un lien interlangue')
‎      .css({
‎        fontSize: '14px',
‎        marginLeft: '8px',
‎        padding: '1px 5px',
‎        background: 'transparent',
‎        border: '1px solid transparent',
‎        borderRadius: '3px',
‎        color: '#555',
‎        cursor: 'pointer',
‎        textDecoration: 'none',
‎        transition: 'background 0.2s, color 0.2s'
‎      })
‎      .hover(
‎        function () {
‎          $(this).css({ background: '#eaf3ff', color: '#000' });
‎        },
‎        function () {
‎          $(this).css({ background: 'transparent', color: '#555' });
‎        }
‎      )
‎      .click(function () {
‎        var code = prompt('Code langue ? (ex : en, es, wp, etc.) ou catégorie ?');
‎        if (!code) return;
‎        var titre = prompt('Titre de la page dans cette langue ?');
‎        if (!titre) return;
‎
‎        fetch(mw.util.getUrl(mw.config.get('wgPageName'), { action: 'raw' }))
‎          .then(response => response.text())
‎          .then(text => {
‎            const fakeReq = { responseText: text };
‎            Interlangues_DoEdit(fakeReq, { code: code.trim(), title: titre.trim() });
‎          });
‎      });
‎
‎    $('#firstHeading').append($button);
‎  }
‎
‎});
‎// </nowiki>
