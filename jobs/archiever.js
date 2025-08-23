const cron = require("node-cron");
const  sequelize  = require("../util/database");

cron.schedule("* * * * *", async () => {
  try {
    console.log("Archiving old messages...");

    
    await sequelize.query(`
      INSERT INTO archivedchats (id, message, userId, senderName, type, groupId, createdAt, updatedAt)
      SELECT id, message, userId, senderName, type, groupId, createdAt, updatedAt
      FROM messages
      WHERE createdAt < NOW() - INTERVAL 1 DAY
    `);

    
    await sequelize.query(`
      DELETE FROM messages
      WHERE createdAt < NOW() - INTERVAL 1 DAY
    `);

    console.log("Archiving completed ✅");
  } catch (err) {
    console.error("❌ Archiving failed:", err);
  }
});
