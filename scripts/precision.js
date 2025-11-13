Hooks.once("init", () => {
  console.log("CoC7 Weapon Precision | Initialisation du module");

  Hooks.on("preCreateItem", (item, data, options, userId) => {
    if (item.type === "weapon" && !item.system?.precision) {
      item.updateSource({ "system.precision": 0 });
    }
  });

  Hooks.on("renderItemSheet", (sheet, html, data) => {
    if (sheet.item.type !== "weapon") return;

    const bulletsField = html.find('input[name="system.bullets"]').closest(".form-group");
    const precisionField = $(`
      <div class="form-group" style="margin-left:10px;">
        <label for="system.precision">Precision</label>
        <input type="number" name="system.precision" value="${sheet.item.system.precision ?? 0}" min="-100" max="100"/>
      </div>
    `);
    bulletsField.after(precisionField);
  });

  Hooks.on("renderChatMessage", async (message, html, data) => {
    const item = message.flags?.coc7?.item;
    if (!item || item.type !== "weapon") return;

    const precision = item.system?.precision ?? 0;
    const precisionDisplay = `<p><strong>Precision:</strong> ${precision >= 0 ? "+" : ""}${precision}</p>`;
    html.find(".chat-card").prepend(precisionDisplay);
  });

  Hooks.on("coc7.preAttackRoll", async (actor, item, options) => {
    if (item.type !== "weapon") return;

    const precision = item.system?.precision ?? 0;
    const skillKey = item.system["item-skill"];
    const skillValue = actor.system.skills[skillKey]?.value ?? 0;

    options.skillValue = skillValue + precision;
  });
});
