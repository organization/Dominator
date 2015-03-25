//TODO: Complete @param documentation

/**
 * @param {number} par1int
 * @param {number} par2int
 * @param {number} par3int
 */
addItemInventory = function(par1int, par2int, par3int){};
/**
 * @param par1int, par2String
 */
bl_setMobSkin = function(par1int, par2String){};
/**
 * @param par1double, par2double, par3double, par4int, par5String
 */
bl_spawnMob = function(par1double, par2double, par3double, par4int, par5String){};
/**
 * @param par1String
 */
clientMessage = function(par1String){};
/**
 * @param par1double, par2double, par3double, par4double
 */
explode = function(par1double, par2double, par3double, par4double){};
getCarriedItem = function(){};
getLevel = function(){};
/**
 * @param par1Object
 */
getPitch = function(par1Object){};
getPlayerEnt = function(){};
getPlayerX = function(){};
getPlayerY = function(){};
getPlayerZ = function(){};
/**
 * @param {number} par1int
 * @param {number} par2int
 * @param {number} par3int
 */
getTile = function(par1int, par2int, par3int){};
/**
 * @param par1Object
 */
getYaw = function(par1Object){};
preventDefault = function(){};
/**
 * @param par1String
 */
print = function(par1String){};
/**
 * @param par1int, par2int
 */
rideAnimal = function(par1int, par2int){};
/**
 * @param par1boolean
 */
setNightMode = function(par1boolean){};
/**
 * @param par1int, par2double, par3double, par4double
 */
setPosition = function(par1int, par2double, par3double, par4double){};
/**
 * @param par1int, par2double, par3double, par4double
 */
setPositionRelative = function(par1int, par2double, par3double, par4double){};
/**
 * @param par1int, par2double, par3double
 */
setRot = function(par1int, par2double, par3double){};
/**
 * @param {number} par1int
 * @param {number} par2int
 * @param {number} par3int, par4int, par5int
 */
setTile = function(par1int, par2int, par3int, par4int, par5int){};
/**
 * @param par1int, par2double
 */
setVelX = function(par1int, par2double){};
/**
 * @param par1int, par2double
 */
setVelY = function(par1int, par2double){};
/**
 * @param par1int, par2double
 */
setVelZ = function(par1int, par2double){};
/**
 * @param par1double, par2double, par3double, par4String
 */
spawnChicken = function(par1double, par2double, par3double, par4String){};
/**
 * @param par1double, par2double, par3double, par4String
 */
spawnCow = function(par1double, par2double, par3double, par4String){};
/**
 * @param par1double, par2double, par3double, par4int, par5String
 */
spawnPigZombie = function(par1double, par2double, par3double, par4int, par5String){};

var ModPE = {};
/**
 * @param par1String
 */
ModPE.getBytesFromTexturePack = function(par1String){};
ModPE.getMinecraftVersion = function(){};
/**
 * @param par1String, par2String
 */
ModPE.langEdit = function(par1String, par2String){};
ModPE.leaveGame = function(){};
/**
 * @param par1String
 */
ModPE.log = function(par1String){};
/**
 * @param par1String
 */
ModPE.openInputStreamFromTexturePack = function(par1String){};
/**
 * @param par1String, par2String
 */
ModPE.overrideTexture = function(par1String, par2String){};
/**
 * @param par1String
 */
ModPE.readData = function(par1String){};
/**
 * @param par1String
 */
ModPE.removeData = function(par1String){};
ModPE.resetFov = function(){};
ModPE.resetImages = function(){};
/**
 * @param par1String, par2String
 */
ModPE.saveData = function(par1String, par2String){};
/**
 * @param par1String
 */
ModPE.selectLevel = function(par1String){};
/**
 * @param par1int
 */
ModPE.setCamera = function(par1int){};
/**
 * @param par1int, par2String, par3int, par4int, par5String, par6int
 */
ModPE.setFoodItem = function(par1int, par2String, par3int, par4int, par5String, par6int){};
/**
 * @param par1double
 */
ModPE.setFov = function(par1double){};
/**
 * @param par1double
 */
ModPE.setGameSpeed = function(par1double){};
/**
 * @param par1String
 */
ModPE.setGuiBlocks = function(par1String){};
/**
 * @param par1int, par2String, par3int, par4String, par5int
 */
ModPE.setItem = function(par1int, par2String, par3int, par4String, par5int){};
/**
 * @param par1String
 */
ModPE.setItems = function(par1String){};
/**
 * @param par1String
 */
ModPE.setTerrain = function(par1String){};
/**
 * @param par1String
 */
ModPE.showTipMessage = function(par1String){};
/**
 * @param par1String
 */
ModPE.takeScreenshot = function(par1String){};

var Level = {};
/**
 * @param par1int, par2double, par3double, par4double, par5double, par6double, par7double, par8int
 */
Level.addParticle = function(par1int, par2double, par3double, par4double, par5double, par6double, par7double, par8int){};
/**
 * @param par1int
 */
Level.biomeIdToName = function(par1int){};
/**
 * @param {number} par1int
 * @param {number} par2int
 * @param {number} par3int, par4boolean
 */
Level.destroyBlock = function(par1int, par2int, par3int, par4boolean){};
/**
 * @param par1double, par2double, par3double, par4double, par5int, par6int, par7int
 */
Level.dropItem = function(par1double, par2double, par3double, par4double, par5int, par6int, par7int){};
/**
 * @param par1double, par2double, par3double, par4double
 */
Level.explode = function(par1double, par2double, par3double, par4double){};
Level.getAddress = function(){};
/**
 * @param par1int, par2int
 */
Level.getBiome = function(par1int, par2int){};
/**
 * @param par1int, par2int
 */
Level.getBiomeName = function(par1int, par2int){};
/**
 * @param {number} par1int
 * @param {number} par2int
 * @param {number} par3int
 */
Level.getBrightness = function(par1int, par2int, par3int){};
/**
 * @param {number} par1int
 * @param {number} par2int
 * @param {number} par3int, par4int
 */
Level.getChestSlot = function(par1int, par2int, par3int, par4int){};
/**
 * @param {number} par1int
 * @param {number} par2int
 * @param {number} par3int, par4int
 */
Level.getChestSlotCount = function(par1int, par2int, par3int, par4int){};
/**
 * @param {number} par1int
 * @param {number} par2int
 * @param {number} par3int, par4int
 */
Level.getChestSlotData = function(par1int, par2int, par3int, par4int){};
/**
 * @param {number} par1int
 * @param {number} par2int
 * @param {number} par3int
 */
Level.getData = function(par1int, par2int, par3int){};
/**
 * @param {number} par1int
 * @param {number} par2int
 * @param {number} par3int, par4int
 */
Level.getFurnaceSlot = function(par1int, par2int, par3int, par4int){};
/**
 * @param {number} par1int
 * @param {number} par2int
 * @param {number} par3int, par4int
 */
Level.getFurnaceSlotCount = function(par1int, par2int, par3int, par4int){};
/**
 * @param {number} par1int
 * @param {number} par2int
 * @param {number} par3int, par4int
 */
Level.getFurnaceSlotData = function(par1int, par2int, par3int, par4int){};
Level.getGameMode = function(){};
/**
 * @param par1int, par2int
 */
Level.getGrassColor = function(par1int, par2int){};
/**
 * @param {number} par1int
 * @param {number} par2int
 * @param {number} par3int, par4int
 */
Level.getSignText = function(par1int, par2int, par3int, par4int){};
/**
 * @param {number} par1int
 * @param {number} par2int
 * @param {number} par3int
 */
Level.getTile = function(par1int, par2int, par3int){};
Level.getTime = function(){};
Level.getWorldDir = function(){};
Level.getWorldName = function(){};
/**
 * @param par1double, par2double, par3double, par4String, par5double, par6double
 */
Level.playSound = function(par1double, par2double, par3double, par4String, par5double, par6double){};
/**
 * @param par1int, par2String, par3double, par4double
 */
Level.playSoundEnt = function(par1int, par2String, par3double, par4double){};
/**
 * @param {number} par1int
 * @param {number} par2int
 * @param {number} par3int, par4int, par5int, par6int, par7int
 */
Level.setChestSlot = function(par1int, par2int, par3int, par4int, par5int, par6int, par7int){};
/**
 * @param {number} par1int
 * @param {number} par2int
 * @param {number} par3int, par4int, par5int, par6int, par7int
 */
Level.setFurnaceSlot = function(par1int, par2int, par3int, par4int, par5int, par6int, par7int){};
/**
 * @param par1int
 */
Level.setGameMode = function(par1int){};
/**
 * @param {number} par1int
 * @param {number} par2int
 * @param {number} par3int
 */
Level.setGrassColor = function(par1int, par2int, par3int){};
/**
 * @param par1boolean
 */
Level.setNightMode = function(par1boolean){};
/**
 * @param {number} par1int
 * @param {number} par2int
 * @param {number} par3int, par4int, par5String
 */
Level.setSignText = function(par1int, par2int, par3int, par4int, par5String){};
/**
 * @param {number} par1int
 * @param {number} par2int
 * @param {number} par3int
 */
Level.setSpawn = function(par1int, par2int, par3int){};
/**
 * @param {number} par1int
 * @param {number} par2int
 * @param {number} par3int, par4int
 */
Level.setSpawnerEntityType = function(par1int, par2int, par3int, par4int){};
/**
 * @param {number} par1int
 * @param {number} par2int
 * @param {number} par3int, par4int, par5int
 */
Level.setTile = function(par1int, par2int, par3int, par4int, par5int){};
/**
 * @param par1int
 */
Level.setTime = function(par1int){};
/**
 * @param par1double, par2double, par3double, par4String
 */
Level.spawnChicken = function(par1double, par2double, par3double, par4String){};
/**
 * @param par1double, par2double, par3double, par4String
 */
Level.spawnCow = function(par1double, par2double, par3double, par4String){};
/**
 * @param par1double, par2double, par3double, par4int, par5String
 */
Level.spawnMob = function(par1double, par2double, par3double, par4int, par5String){};

var Player = {};
/**
 * @param {number} par1int
 * @param {number} par2int
 * @param {number} par3int
 */
Player.addItemCreativeInv = function(par1int, par2int, par3int){};
/**
 * @param {number} par1int
 * @param {number} par2int
 * @param {number} par3int
 */
Player.addItemInventory = function(par1int, par2int, par3int){};
Player.canFly = function(){};
/**
 * @param par1int
 */
Player.clearInventorySlot = function(par1int){};
/**
 * @param par1int
 */
Player.getArmorSlot = function(par1int){};
/**
 * @param par1int
 */
Player.getArmorSlotDamage = function(par1int){};
Player.getCarriedItem = function(){};
Player.getCarriedItemCount = function(){};
Player.getCarriedItemData = function(){};
Player.getEntity = function(){};
/**
 * @param par1int
 */
Player.getInventorySlot = function(par1int){};
/**
 * @param par1int
 */
Player.getInventorySlotCount = function(par1int){};
/**
 * @param par1int
 */
Player.getInventorySlotData = function(par1int){};
/**
 * @param par1int
 */
Player.getName = function(par1int){};
Player.getPointedBlockData = function(){};
Player.getPointedBlockId = function(){};
Player.getPointedBlockSide = function(){};
Player.getPointedBlockX = function(){};
Player.getPointedBlockY = function(){};
Player.getPointedBlockZ = function(){};
Player.getPointedEntity = function(){};
Player.getSelectedSlotId = function(){};
Player.getX = function(){};
Player.getY = function(){};
Player.getZ = function(){};
Player.isFlying = function(){};
/**
 * @param par1int
 */
Player.isPlayer = function(par1int){};
/**
 * @param {number} par1int
 * @param {number} par2int
 * @param {number} par3int
 */
Player.setArmorSlot = function(par1int, par2int, par3int){};
/**
 * @param par1boolean
 */
Player.setCanFly = function(par1boolean){};
/**
 * @param par1boolean
 */
Player.setFlying = function(par1boolean){};
/**
 * @param par1int
 */
Player.setHealth = function(par1int){};

var Entity = {};
Entity.getAll = function(){};
/**
 * @param par1int
 */
Entity.getAnimalAge = function(par1int){};
/**
 * @param par1int
 */
Entity.getEntityTypeId = function(par1int){};
/**
 * @param par1int
 */
Entity.getHealth = function(par1int){};
/**
 * @param par1int
 */
Entity.getMobSkin = function(par1int){};
/**
 * @param par1int
 */
Entity.getNameTag = function(par1int){};
/**
 * @param par1int
 */
Entity.getPitch = function(par1int){};
/**
 * @param par1int
 */
Entity.getRenderType = function(par1int){};
/**
 * @param par1int
 */
Entity.getRider = function(par1int){};
/**
 * @param par1int
 */
Entity.getRiding = function(par1int){};
/**
 * @param par1int
 */
Entity.getUniqueId = function(par1int){};
/**
 * @param par1int
 */
Entity.getVelX = function(par1int){};
/**
 * @param par1int
 */
Entity.getVelY = function(par1int){};
/**
 * @param par1int
 */
Entity.getVelZ = function(par1int){};
/**
 * @param par1int
 */
Entity.getX = function(par1int){};
/**
 * @param par1int
 */
Entity.getY = function(par1int){};
/**
 * @param par1int
 */
Entity.getYaw = function(par1int){};
/**
 * @param par1int
 */
Entity.getZ = function(par1int){};
/**
 * @param par1int
 */
Entity.remove = function(par1int){};
/**
 * @param par1int, par2int
 */
Entity.rideAnimal = function(par1int, par2int){};
/**
 * @param par1int, par2int
 */
Entity.setAnimalAge = function(par1int, par2int){};
/**
 * @param par1int, par2String
 */
Entity.setCape = function(par1int, par2String){};
/**
 * @param {number} par1int
 * @param {number} par2int
 * @param {number} par3int, par4int
 */
Entity.setCarriedItem = function(par1int, par2int, par3int, par4int){};
/**
 * @param par1int, par2double, par3double
 */
Entity.setCollisionSize = function(par1int, par2double, par3double){};
/**
 * @param par1int, par2int
 */
Entity.setFireTicks = function(par1int, par2int){};
/**
 * @param par1int, par2int
 */
Entity.setHealth = function(par1int, par2int){};
/**
 * @param par1int, par2String
 */
Entity.setMobSkin = function(par1int, par2String){};
/**
 * @param par1int, par2String
 */
Entity.setNameTag = function(par1int, par2String){};
/**
 * @param par1int, par2double, par3double, par4double
 */
Entity.setPosition = function(par1int, par2double, par3double, par4double){};
/**
 * @param par1int, par2double, par3double, par4double
 */
Entity.setPositionRelative = function(par1int, par2double, par3double, par4double){};
/**
 * @param par1int, par2int
 */
Entity.setRenderType = function(par1int, par2int){};
/**
 * @param par1int, par2double, par3double
 */
Entity.setRot = function(par1int, par2double, par3double){};
/**
 * @param par1int, par2boolean
 */
Entity.setSneaking = function(par1int, par2boolean){};
/**
 * @param par1int, par2double
 */
Entity.setVelX = function(par1int, par2double){};
/**
 * @param par1int, par2double
 */
Entity.setVelY = function(par1int, par2double){};
/**
 * @param par1int, par2double
 */
Entity.setVelZ = function(par1int, par2double){};
/**
 * @param par1double, par2double, par3double, par4int, par5String
 */
Entity.spawnMob = function(par1double, par2double, par3double, par4int, par5String){};

var Item = {};
/**
 * @param {number} par1int
 * @param {number} par2int
 * @param {number} par3int, par4Scriptable
 */
Item.addCraftRecipe = function(par1int, par2int, par3int, par4Scriptable){};
/**
 * @param {number} par1int
 * @param {number} par2int
 * @param {number} par3int
 */
Item.addFurnaceRecipe = function(par1int, par2int, par3int){};
/**
 * @param {number} par1int
 * @param {number} par2int
 * @param {number} par3int, par4Scriptable, par5Scriptable
 */
Item.addShapedRecipe = function(par1int, par2int, par3int, par4Scriptable, par5Scriptable){};
/**
 * @param par1int, par2int, par3boolean
 */
Item.getName = function(par1int, par2int, par3boolean){};
/**
 * @param {number} par1int
 * @param {number} par2int
 * @param {number} par3int
 */
Item.setCategory = function(par1int, par2int, par3int){};
/**
 * @param par1int, par2boolean
 */
Item.setHandEquipped = function(par1int, par2boolean){};
/**
 * @param par1int, par2int
 */
Item.setMaxDamage = function(par1int, par2int){};

var Block = {};
/**
 * @param par1int, par2String, par3Object, par4Object, par5Object, par6Object
 */
Block.defineBlock = function(par1int, par2String, par3Object, par4Object, par5Object, par6Object){};
/**
 * @param par1int
 */
Block.getRenderType = function(par1int){};
/**
 * @param par1int, par2Scriptable
 */
Block.setColor = function(par1int, par2Scriptable){};
/**
 * @param par1int, par2double
 */
Block.setDestroyTime = function(par1int, par2double){};
/**
 * @param par1int, par2double
 */
Block.setExplosionResistance = function(par1int, par2double){};
/**
 * @param par1int, par2int
 */
Block.setLightLevel = function(par1int, par2int){};
/**
 * @param par1int, par2int
 */
Block.setLightOpacity = function(par1int, par2int){};
/**
 * @param par1int, par2int
 */
Block.setRenderLayer = function(par1int, par2int){};
/**
 * @param par1int, par2int
 */
Block.setRenderType = function(par1int, par2int){};
/**
 * @param par1int, par2double, par3double, par4double, par5double, par6double, par7double
 */
Block.setShape = function(par1int, par2double, par3double, par4double, par5double, par6double, par7double){};

var Server = {};
Server.getAddress = function(){};
Server.getAllPlayerNames = function(){};
Server.getAllPlayers = function(){};
Server.getPort = function(){};
/**
 * @param par1String, par2int
 */
Server.joinServer = function(par1String, par2int){};
/**
 * @param par1String
 */
Server.sendChat = function(par1String){};

var ChatColor = {
    "AQUA": "§b",
    "BEGIN": "§",
    "BLACK": "§0",
    "BLUE": "§9",
    "BOLD": "§l",
    "DARK_AQUA": "§3",
    "DARK_BLUE": "§1",
    "DARK_GRAY": "§8",
    "DARK_GREEN": "§2",
    "DARK_PURPLE": "§5",
    "DARK_RED": "§4",
    "GOLD": "§6",
    "GRAY": "§7",
    "GREEN": "§a",
    "LIGHT_PURPLE": "§d",
    "RED": "§c",
    "RESET": "§r",
    "WHITE": "§f",
    "YELLOW": "§e"
};

var ItemCategory = {
    "DECORATION": 8,
    "FOOD": 4,
    "INTERNAL": -1,
    "MATERIAL": 1,
    "TOOL": 2
};

var ParticleType = {
    "blockcrack": 1,
    "cloud": 4,
    "crit": 2,
    "flame": 5,
    "heart": 14,
    "itemcrack": 9,
    "lava": 6,
    "mobFlame": 13,
    "redstone": 8,
    "smoke": 3,
    "snowballpoof": 10
};

var EntityType = {
    "ARROW": 80,
    "CHICKEN": 10,
    "COW": 11,
    "CREEPER": 33,
    "EGG": 82,
    "ENDERMAN": 38,
    "FALLING_BLOCK": 66,
    "ITEM": 64,
    "MINECART": 84,
    "MUSHROOM_COW": 16,
    "PAINTING": 83,
    "PIG": 12,
    "PIG_ZOMBIE": 36,
    "PLAYER": 63,
    "PRIMED_TNT": 65,
    "SHEEP": 13,
    "SILVERFISH": 39,
    "SKELETON": 34,
    "SLIME": 37,
    "SNOWBALL": 81,
    "SPIDER": 35,
    "VILLAGER": 15,
    "WOLF": 14,
    "ZOMBIE": 32
};

var EntityRenderType = {
    "arrow": 20,
    "chicken": 5,
    "cow": 6,
    "creeper": 17,
    "egg": 21,
    "enderman": 19,
    "minecart": 26,
    "mushroomCow": 7,
    "pig": 8,
    "player": 3,
    "sheep": 9,
    "silverfish": 16,
    "skeleton": 14,
    "snowball": 23,
    "spider": 15,
    "tnt": 2,
    "villager": 11
};