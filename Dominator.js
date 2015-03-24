/**
 * Copyright 2015 Organization
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

"use strict";

var entityType = [];
entityType[10] = {name: "chicken", cc: 75};
entityType[11] = {name: "cow",     cc: 87};
entityType[12] = {name: "pig",     cc: 64};
entityType[13] = {name: "sheep",   cc: 47};
entityType[14] = {name: "wolf",       cc: 113}; //양을 공격하므로 범죄계수 상승
entityType[15] = {name: "villager",   cc: -1};
entityType[16] = {name: "mushroom",   cc: 30};
entityType[32] = {name: "zombie",     cc: 304};
entityType[33] = {name: "creeper",    cc: 562};
entityType[34] = {name: "skeleton",   cc: 486};
entityType[35] = {name: "spider",     cc: 312};
entityType[36] = {name: "pig zombie", cc: 436};
entityType[37] = {name: "slime",      cc: 180};
entityType[38] = {name: "enderman",   cc: 497};
entityType[39] = {name: "silverfish", cc: 253};
entityType[65] = {name: "Primed TNT", cc: "A+"};
entityType[80] = {name: "arrow",      cc: "A+"};

/**
 * @param {number} entityTypeId
 * @param {number} entityId
 * @constructor
 */
function Target(entityTypeId, entityId){
	this.eid = entityId;
	this.cc = entityType[entityTypeId].cc;
	if(this.cc === -1){
		this.cc = Math.floor(Math.random() * 400);
	}
	this.lastCheck = java.lang.System.currentTimeMillis();
}

Target.prototype = {};

Target.prototype.getCrimeCoefficient = function(){
	var value;

    if(this.cc === "A+"){
        return this.cc;
    }
	
	var now = java.lang.System.currentTimeMillis();
	var maxChange = (now - this.lastCheck) / 300000;

    value = Math.max(0, this.cc + Math.floor(Math.random() * maxChange) - (maxChange / 2));
	
	var worldTime = Level.getTime();
	
	worldTime = worldTime % 24000;
	
	this.cc = value;

    value = Math.round(value);
	return value + (worldTime > 14000 ? 100 : 0); // TODO: Change this value sometime whenever in future
};

Target.prototype.getColor = function(){
	var rand = new java.lang.Random();
	var r = rand.nextInt(255);
	var g = rand.nextInt(255);
	var b = rand.nextInt(255);
	if(this.cc === "A+"){
		return android.graphics.Color.parseColor("#00000000");
	}
	
	r -= this.cc / 3;
	g -= this.cc / 3;
	b -= this.cc / 3;

	return android.graphics.Color.rgb(r < 0 ? 0 : r, g < 0 ? 0 : g, b < 0 ? 0 : b);
};

Target.prototype.setCCoefficient = function(coefficient){
	this.cc = coefficient;
};

Target.prototype.getId = function(){
	return this.eid;
};

/**
 * @param {function} request
 * @param {number} interval
 * @constructor
 */
function Loop(request, interval){
    this.request = request;
    this.interval = interval || 0;
    this.isAlive = true;
}

Loop.prototype = {};

Loop.prototype.start = function(){
    var that = this;
    runOnThread(function(){
        while(that.isAlive && that.request !== null){
            that.request();

            if(that.interval > 0){
                try{
                    java.lang.Thread.sleep(that.interval);
                }catch(e){}
            }
        }
    });
};

Loop.prototype.kill = function(){
    this.isAlive = false;
    this.request = null;
};

function Dominator(){
	
}

Dominator.prototype = {};

Dominator.prototype.init = function(){
	var that = this;
	
	runOnUiThread(function(){
		that.layout = new android.widget.RelativeLayout(ctx);
		
		that.coefficientWrapper = new android.widget.RelativeLayout(ctx);
		that.typeText = new android.widget.TextView(ctx);
		that.coefficientText = new android.widget.TextView(ctx);
		that.targetText = new android.widget.TextView(ctx);
		
		that.progressWrapper = new android.widget.RelativeLayout(ctx);
		that.progressBar = new android.widget.ImageView(ctx);
		
		that.progressBitmap = getProgressBitmap();
		
		that.popupWindow = new android.widget.PopupWindow(that.layout);
		
		that.isAnalyzing = false;
	});
};

Dominator.prototype.showProgress = function(delay){	
	this.isAnalyzing = true;
	this.progressBar.setImageBitmap(this.progressBitmap);
	
	var that = this;
	progressWindow.showAtLocation(ctx.getWindow().getDecorView(), android.view.Gravity.TOP | android.view.Gravity.RIGHT, Location.windowPos.x, Location.windowPos.y);//Screen.centerX, Screen.centerY - (Screen.centerY / 8));
    runOnThread(function(){
        for(var i = 0; i <= 100; i++){
            runOnUiThread(function(){
                //noinspection JSReferencingMutableVariableFromClosure
                that.progressBar.setImageBitmap(drawProgress(i, that.progressBitmap));
            });
            try{
                java.lang.Thread.sleep(delay);
            }catch(e){

            }
        }
        that.isAnalyzing = false;
    });
}

function getProgressBitmap(){
	var bitmap = android.graphics.Bitmap.createBitmap(500, 70, android.graphics.Bitmap.Config.ARGB_8888);
	
	var bgPaint = new android.graphics.Paint();
	bgPaint.setColor(android.graphics.Color.parseColor("#30303080"));
	
	var txtPaint = new android.graphics.Paint();
	txtPaint.setColor(android.graphics.Color.WHITE);
	txtPaint.setTextSize(30);

	var canvas = new android.graphics.Canvas(bitmap);
	canvas.drawText("Analyse", 100, 30, txtPaint);
	canvas.drawText("[", 50, 70, txtPaint);
	canvas.drawRect(60, 35, 440, 70, bgPaint);
	canvas.drawText("]", 450, 70, txtPaint);
	
	return bitmap;
}

function drawProgress(progressPercentage, bitmap){ // TODO: Insert into 'Dominator' class
	var clonedBitmap = android.graphics.Bitmap.createBitmap(bitmap);
	
	var canvas = new android.graphics.Canvas(clonedBitmap);
	
	var fgPaint = new android.graphics.Paint();
	fgPaint.setColor(blinkColor);
	
	var wholeSize = 380 * progressPercentage / 100;
	
	canvas.drawRect(60, 35, 60 + wholeSize, 70, fgPaint);
	
	return clonedBitmap;
}

Dominator.prototype.showCoefficient = function(value){
	var that = this;
	
	runOnUiThread(function(){
		that.coefficientWrapper.setVisibility(android.view.View.INVISIBLE);
		that.progressWrapper.setVisibility(android.view.View.VISIBLE);
		runOnThread(function(){
			// TODO: show progress and coefficient
		});
	});
}

var aimedEntity = -1;
var nonAimCnt = 0;
var entities = [];

var checkingLoop = null;

var ctx = com.mojang.minecraftpe.MainActivity.currentMainActivity.get();

var sdcard = android.os.Environment.getExternalStorageDirectory();
var dataFolder = new java.io.File(sdcard, "Dominator");
dataFolder.mkdir();

var blinkColor = android.graphics.Color.rgb(3, 147, 216);

/** @type {android.widget.PopupWindow} */
var popupWindow;

var aimerWindow = null;
var progressWindow = null;
var enforcementWindow = null;
var Screen = {};
var GUI = {};
var Location = {};

var progressBitmap = null;


//DOMINATOR FUNCTION

//left bullet count
var leftDestroy = 3;
var leftEliminator = 4;

//NON LETHAL PARALYZER FUNCTION

//마비 시간
var PARALYZE_TIME = 500;

var paralyzerEntity = [];
// {entity, x, y, z, time}
	
function runOnUiThread(request){
	ctx.runOnUiThread({run: request});
}

function runOnThread(request){
	new java.lang.Thread({run: request}).start();
}

function createOnClickListener(onClick){
    return new android.view.View.OnClickListener({onClick: onClick});
}

function createOnTouchListener(onTouch){
    return new android.view.View.OnTouchListener({onTouch: onTouch});
}

runOnThread(function(){
	var displayMetrics = ctx.getResources().getDisplayMetrics();
	Screen.width = displayMetrics.widthPixels;
	Screen.height = displayMetrics.heightPixels;
	Screen.centerX = Math.floor(Screen.width / 2);
	Screen.centerY = Math.floor(Screen.height / 2);
	
	Location.centerX = 200;
	Location.centerY = 200;
	
	Location.windowPos = {};
	Location.windowPos.x = 200;
	Location.windowPos.y = 200;
	
	runOnUiThread(function(){
		GUI.layout = new android.widget.RelativeLayout(ctx);

		GUI.typeText = new android.widget.TextView(ctx);
		GUI.coefficientText = new android.widget.TextView(ctx);
		GUI.targetText = new android.widget.TextView(ctx);
		GUI.image = new android.widget.ImageView(ctx);
		
		//analyse Flavor
		GUI.analyseWrapper = new android.widget.RelativeLayout(ctx);
		GUI.analyseWrapper.setLayoutParams(new android.widget.RelativeLayout.LayoutParams(600, android.view.ViewGroup.LayoutParams.WRAP_CONTENT));
		GUI.progressBar = new android.widget.ImageView(ctx);
		
		GUI.isAnalyzing = true;
		
		progressBitmap = getProgressBitmap();
		
		GUI.image.setImageBitmap(progressBitmap);
		GUI.progressBar.setOnTouchListener(createOnTouchListener(function(){
            return false;
        }));
		
		GUI.analyseWrapper.addView(GUI.progressBar);
		
		progressWindow = new android.widget.PopupWindow(GUI.analyseWrapper);
		progressWindow.setFocusable(false);
		progressWindow.setTouchable(false);
		progressWindow.setWidth(450);
		progressWindow.setWindowLayoutMode(android.view.ViewGroup.LayoutParams.WRAP_CONTENT, android.view.ViewGroup.LayoutParams.WRAP_CONTENT);
		
		//End of Analysing Flavor
		
		//enforcement Flavor
		GUI.enforcementWrapper = new android.widget.RelativeLayout(ctx);
		
		GUI.enforcementButton = new android.widget.Button(ctx);
		GUI.enforcementButton.setLayoutParams(new android.widget.RelativeLayout.LayoutParams(android.view.ViewGroup.LayoutParams.WRAP_CONTENT, android.view.ViewGroup.LayoutParams.WRAP_CONTENT));
		GUI.enforcementButton.setText("D");
		GUI.enforcementButton.setOnClickListener(createOnClickListener(function(){
            var yaw = Math.floor(getYaw());
            var pitch = Math.floor(getPitch());
            var sin = -Math.sin(yaw / 180 * Math.PI);
            var cos = Math.cos(yaw / 180 * Math.PI);
            var tan = -Math.sin(pitch / 180 * Math.PI);
            var pcos = Math.cos(pitch / 180 * Math.PI);

            var x = Player.getX();
            var y = Player.getY();
            var z = Player.getZ();

            var entityExists = false;

            for(var cnt = 0; cnt < 50; cnt++){
                var xx = x + (0.4 + cnt) * sin * pcos;
                var yy = y + (0.4 + cnt) * tan;
                var zz = z + (0.4 + cnt) * cos * pcos;

                var ent = entities.filter(function(entity){
                    if(entity.getId() === getPlayerEnt()) return false;
                    var entityX = Entity.getX(entity.getId());
                    var entityY = Entity.getY(entity.getId());
                    var entityZ = Entity.getZ(entity.getId());

                    //noinspection JSReferencingMutableVariableFromClosure
                    return (entityX + 1 > xx && entityX - 1 < xx) && (entityY + 1 > yy && entityY - 1) && (entityZ + 1 > zz && entityZ - 1 < zz);
                });
                if(ent.length > 0){
                    enforce(ent[0].getCrimeCoefficient(), ent[0]);
                    break;
                }
            }
        }));
		GUI.enforcementWrapper.addView(GUI.enforcementButton);
		
		enforcementWindow = new android.widget.PopupWindow(GUI.enforcementWrapper);
		enforcementWindow.setWindowLayoutMode(android.view.ViewGroup.LayoutParams.WRAP_CONTENT, android.view.ViewGroup.LayoutParams.WRAP_CONTENT);
		//End of enforcement Flavor
		
		var bitmap = getBitmap();
		
		GUI.image.setImageBitmap(bitmap);
		GUI.image.setOnTouchListener(createOnClickListener(function(){
            return false;
        }));
		
		GUI.layout.addView(GUI.image);
		
		GUI.typeText.setTextSize(10);
		GUI.typeText.setText("CRIME COEFFICIENT");
		GUI.typeText.setTextColor(android.graphics.Color.WHITE);
		GUI.typeText.setX(Location.centerX);
		GUI.typeText.setY(Location.centerY - 100);
		
		GUI.coefficientText.setTextColor(android.graphics.Color.WHITE);
		GUI.coefficientText.setTextSize(20);
		GUI.coefficientText.setX(Location.centerX);
		GUI.coefficientText.setY(Location.centerY - 65);
		
		GUI.targetText.setTextColor(android.graphics.Color.WHITE);
		GUI.targetText.setX(Location.centerX);
		GUI.targetText.setY(Location.centerY + 70);
		
		GUI.layout.addView(GUI.typeText);
		GUI.layout.addView(GUI.coefficientText);
		GUI.layout.addView(GUI.targetText);
		
		popupWindow = new android.widget.PopupWindow(GUI.layout);
		popupWindow.setFocusable(false);
		popupWindow.setTouchable(false);
		popupWindow.setWindowLayoutMode(android.view.ViewGroup.LayoutParams.WRAP_CONTENT, android.view.ViewGroup.LayoutParams.WRAP_CONTENT);
		
		var aimLayout = new android.widget.RelativeLayout(ctx);
		var imageView = new android.widget.ImageView(ctx);
		
		var aimBitmap = android.graphics.Bitmap.createBitmap(60, 60, android.graphics.Bitmap.Config.ARGB_8888);
		var paint = new android.graphics.Paint();
		paint.setStyle(android.graphics.Paint.Style.STROKE);
		paint.setColor(blinkColor);
		paint.setStrokeWidth(5.0);
		
		var canvas = new android.graphics.Canvas(aimBitmap);
		canvas.drawRect(0, 0, 50, 50, paint);
		imageView.setImageBitmap(aimBitmap);
		aimLayout.addView(imageView);
		
		aimerWindow = new android.widget.PopupWindow(aimLayout);
		aimerWindow.setTouchable(false);
		aimerWindow.setWindowLayoutMode(android.view.ViewGroup.LayoutParams.WRAP_CONTENT, android.view.ViewGroup.LayoutParams.WRAP_CONTENT);
	});
});


function findTarget(entity){
	/*for(var target in entities){
		if(entities[target].getId() == entity){
			return entities[target];
		}
	}*/
	return entities[entity];
}

function entityAddedHook(entity){
	if(entityType[Entity.getEntityTypeId(entity)] !== undefined){
		entities[entity] = new Target(Entity.getEntityTypeId(entity), entity);
	}
}

function deathHook(murderer, victim){
	var murdererEnt = findTarget(murderer);
	
	if(murdererEnt == null || murdererEnt == undefined){
		return;
	}

	if(victim == getPlayerEnt()){
		murdererEnt.setCCoefficient("A+");
	}else{
		if(murdererEnt.getCrimeCoefficient() !== "A+") murdererEnt.setCCoefficient(murdererEnt.getCrimeCoefficient() + 300);
		if(aimedEntity == murdererEnt.getId()) setText(GUI.coefficientText, murdererEnt.getCrimeCoefficient(), 80, null);
	}
}

function attackHook(attacker, victim){
	var attackerEnt = findTarget(attacker);
	var victimEnt = findTarget(victim);
	
	if(attackerEnt == null || attackerEnt == undefined){
		return;
	}
		
	if(victim == getPlayerEnt()){
		attackerEnt.setCCoefficient("A+");
		if(aimedEntity == attackerEnt.getId()) setText(GUI.coefficientText, attackerEnt.getCrimeCoefficient(), 80, null);
	}else{
		if(attackerEnt.getCrimeCoefficient() !== "A+") attackerEnt.setCCoefficient(attackerEnt.getCrimeCoefficient() + 100);
		
		if(victimEnt !== null || victimEnt !== undefined){
			victimEnt.setCCoefficient(victim.getCrimeCoefficient() + 50);
		}
		
		if(aimedEntity == victimEnt.getId()) setText(GUI.coefficientText, victimEnt.getCrimeCoefficient(), 80, null);
		if(aimedEntity == attackerEnt.getId()) setText(GUI.coefficientText, attackerEnt.getCrimeCoefficient(), 80, null);
	}
}

function entityRemovedHook(entity){
	if(entities[entity] !== undefined){
		delete entities[entity];
	}
}

function getBitmap(){
	var paint = new android.graphics.Paint();
	paint.setColor(android.graphics.Color.WHITE);
	paint.setStyle(android.graphics.Paint.Style.STROKE);
	paint.setStrokeWidth(5.0);
	
	var textPaint = new android.graphics.Paint();
	textPaint.setColor(android.graphics.Color.WHITE);
	textPaint.setTextSize(30);
	
	var rectP = new android.graphics.Paint();
	rectP.setColor(android.graphics.Color.BLACK);
	rectP.setAlpha(0x80);
	
	var bitmap = android.graphics.Bitmap.createBitmap(550, 410, android.graphics.Bitmap.Config.ARGB_8888);
	var canvas = new android.graphics.Canvas(bitmap);
	canvas.drawRect(Location.centerX, Location.centerY - 100, Location.centerX + 350, Location.centerY - 60, rectP);
	canvas.drawRect(Location.centerX, Location.centerY + 35,  Location.centerX + 350, Location.centerY + 75, rectP);
	
	GUI.typeText.setX(Location.centerX);
	GUI.typeText.setY(Location.centerY - 100);
	GUI.coefficientText.setX(Location.centerX);
	GUI.coefficientText.setY(Location.centerY - 65);
	GUI.targetText.setX(Location.centerX);
	GUI.targetText.setY(Location.centerY + 70);
	runOnUiThread(function(){
		GUI.typeText.setText("CRIME COEFFICIENT");
		GUI.coefficientText.setText("");
		GUI.targetText.setText("");
	});
	
	canvas.drawText("TARGET", Location.centerX, Location.centerY + 70, textPaint);
	canvas.drawCircle(Location.centerX - 10, Location.centerY + 10, 185, paint);
	canvas.drawCircle(Location.centerX,		 Location.centerY,		200, paint);
	
	return bitmap;
}

function newLevel(){
    checkingLoop = new Loop(function(){
        var yaw = Math.floor(getYaw());
        var pitch = Math.floor(getPitch());
        var sin = -Math.sin(yaw / 180 * Math.PI);
        var cos = Math.cos(yaw / 180 * Math.PI);
        var tan = -Math.sin(pitch / 180 * Math.PI);
        var pcos = Math.cos(pitch / 180 * Math.PI);

        var x = Player.getX();
        var y = Player.getY();
        var z = Player.getZ();

        var entityExists = false;

        for(var cnt = 0; cnt < 50; cnt++){
            var xx = x + (0.4 + cnt) * sin * pcos;
            var yy = y + (0.4 + cnt) * tan;
            var zz = z + (0.4 + cnt) * cos * pcos;

            var ent = entities.filter(function(entity){
                if(entity.getId() === getPlayerEnt()){
                    return false;
                }
                var entityX = Entity.getX(entity.getId());
                var entityY = Entity.getY(entity.getId());
                var entityZ = Entity.getZ(entity.getId());

                //noinspection JSReferencingMutableVariableFromClosure
                return (entityX + 1 > xx && entityX - 1 < xx) && (entityY + 1 > yy && entityY - 1) && (entityZ + 1 > zz && entityZ - 1 < zz);
            });
            if(ent.length > 0){
                entityExists = true;

                if(ent[0].getId() !== aimedEntity){
                    if(popupWindow !== null){
                        runOnUiThread(function(){
                            popupWindow.dismiss();
                        });
                    }
                    aimedEntity = ent[0].getId();
                    var value = entities[aimedEntity].getCrimeCoefficient();
                    setCrimeCoefficient(value + "", null);
                }
                break;
            }
        }
        if(!entityExists){
            if(aimedEntity !== -1){
                nonAimCnt++;
                if(nonAimCnt >= 2){
                    if(popupWindow !== null){
                        runOnUiThread(function(){
                            popupWindow.dismiss();
                            if(enforcementWindow != null){
                                enforcementWindow.dismiss();
                            }
                        });
                    }
                    nonAimCnt = 0;
                    aimedEntity = -1;
                }
            }
        }

    }, 500);
	checkingLoop.start();
	
	runOnUiThread(function(){
		aimerWindow.showAtLocation(ctx.getWindow().getDecorView(), android.view.Gravity.CENTER, 0, 0);
	});
}

function leaveGame(){	
	runOnUiThread(function(){
		if(popupWindow !== null){
			popupWindow.dismiss();
		}
		if(aimerWindow !== null){
			aimerWindow.dismiss();
		}
		if(progressWindow !== null){
			progressWindow.dismiss();
		}
		if(enforcementWindow !== null){
			enforcementWindow.dismiss();
		}
	});
    checkingLoop.kill();
}

function setText(textView, str, delay, after){
    runOnThread(function(){
        runOnUiThread(function(){
            textView.setText("");
        });
        var text = "";
        for(var i = 0; i < str.length; i++){
            text += (str.charAt(i) + "");
            runOnUiThread(function(){
                //noinspection JSReferencingMutableVariableFromClosure
                textView.setText(text);
            });
            try{
                java.lang.Thread.sleep(delay);
            }catch(e){
            }
        }
        runOnUiThread(function(){
            textView.setBackgroundColor(blinkColor);
        });
        try{
            java.lang.Thread.sleep(80);
        }catch(e){
        }
        runOnUiThread(function(){
            textView.setBackgroundColor(android.graphics.Color.TRANSPARENT);
        });
        if(after !== null){
            after();
        }
    });
}

function enforce(cc, target){
	if(cc === "A+"){
		destroyDecompose(target);
		return;
	}
	
	if(cc >= 100 && cc < 300){
		paralyze(target);
	}else if(300 <= cc){
		eliminate(target);
	}
}

function paralyze(target){
	paralyzerEntity.push({entity:target, x:Entity.getX(target.getId()), y:Entity.getY(target.getId()), z:Entity.getZ(target.getId()), time:PARALYZE_TIME});
}

function eliminate(target){
	
}

function destroyDecompose(target){
    runOnThread(function(){
        var entX = Entity.getX(target.getId());
        var entY = Entity.getY(target.getId());
        var entZ = Entity.getZ(target.getId());
        Entity.remove(target.getId());
        createDestroyDecomposeEffect(5, 100, entX, entY, entZ);
        try{
            java.lang.Thread.sleep(750);
        }catch(e){
        }

        deleteDestroyDecomposeEffect(5, entX, entY, entZ);

        explode(entX, entY, entZ, 5);
    });
}

function createDestroyDecomposeEffect(size, delay, x, y, z){
	for(var curSize = 1; curSize <= size; curSize += 2){
		createOrbEffect(curSize, 35, 3, x, y, z);
		try{
			java.lang.Thread.sleep(delay);
		}catch(e){}
	}
}

function deleteDestroyDecomposeEffect(size, x, y, z){
	for(var curSize = 1; curSize <= size; curSize += 2){
		createOrbEffect(curSize, 0, 0, x, y, z);
	}
}

function createOrbEffect(size, blockId, damage, x, y, z){
	var orX = Math.round(x);
	var orY = Math.round(y);
	var orZ = Math.round(z);
	
	var hSize = Math.floor(size / 2);
	
	for(var regY = 0; regY < size; regY++){
		for(var regX = 0; regX < size; regX++){
			for(var regZ = 0; regZ < size; regZ++){
				setTile(orX + (regX - hSize), orY + (regY - hSize), orZ + (regZ - hSize), blockId, damage);
			}
		}
	}
	
	var cnt = 0;
			
	var irregX;
	var irregY;
	var irregZ;
	
	var irregHSize;
	
	for(var irregSize = size - 2; irregSize > 0; irregSize -= 2){

		var irregOffset = hSize + cnt + 1;
		irregHSize = Math.floor(irregSize / 2);
		
		//up and down
		for(irregX = 0; irregX < irregSize; irregX++){
			for(irregZ = 0; irregZ < irregSize; irregZ++){
				setTile(orX + (irregX - irregHSize), orY - irregOffset, orZ + (irregZ - irregHSize), blockId, damage);
				setTile(orX + (irregX - irregHSize), orY + irregOffset, orZ + (irregZ - irregHSize), blockId, damage);
			}
		}
		
		//left and right
		for(irregX = 0; irregX < irregSize; irregX++){
			for(irregY = 0; irregY < irregSize; irregY++){
				setTile(orX + (irregX - irregHSize), orY + (irregY - irregHSize), orZ - irregOffset, blockId, damage);
				setTile(orX + (irregX - irregHSize), orY + (irregY - irregHSize), orZ + irregOffset, blockId, damage);
			}
		}
		
		//front and back
		for(irregZ = 0; irregZ < irregSize; irregZ++){
			for(irregY = 0; irregY < irregSize; irregY++){
				setTile(orX - irregOffset, orY + (irregY - irregHSize), orZ + (irregZ - irregHSize), blockId, damage);
				setTile(orX + irregOffset, orY + (irregY - irregHSize), orZ + (irregZ - irregHSize), blockId, damage);
			}
		}
		try{
			java.lang.Thread.sleep(20);
		}catch(e){
			
		}
		cnt++;
	}
	
}

function modTick(){
	for(var target in paralyzerEntity){
		//if(!target) continue;
        if(!paralyzerEntity.hasOwnProperty(target)) continue;
		
		Entity.setPosition(paralyzerEntity[target].entity.getId(), paralyzerEntity[target].x, paralyzerEntity[target].y, paralyzerEntity[target].z);
		paralyzerEntity[target].time--;
		if(paralyzerEntity[target].time <= 0){
			delete paralyzerEntity[target];
		}
	}
}

function setCrimeCoefficient(value, after){

	runOnUiThread(function(){
			showProgress(10);
	});
	try{
		java.lang.Thread.sleep(1000);
	}catch(e){
		
	}
	runOnUiThread(function(){
			if(progressWindow !== null){
				progressWindow.dismiss();
			}
			popupWindow.showAtLocation(ctx.getWindow().getDecorView(), android.view.Gravity.TOP | android.view.Gravity.RIGHT, Location.windowPos.x, Location.windowPos.y);
			GUI.typeText.setText("CRIME COEFFICIENT");
			GUI.targetText.setText("");
			GUI.coefficientText.setText("");
	});
	
	var targetText = "Not target";
	if(value === "A+"){
		targetText = "Eliminate target";
		setText(GUI.coefficientText, "Not measure", 40, function(){
			setText(GUI.typeText, "THREAT STATUS", 40, function(){
				setText(GUI.coefficientText, value, 80, null);
				setText(GUI.targetText, targetText, 40, null);
			});
		});
		runOnUiThread(function(){
				enforcementWindow.showAtLocation(ctx.getWindow().getDecorView(), android.view.Gravity.BOTTOM | android.view.Gravity.RIGHT, 0, 0);
		});
		return;
	}
	if(value >= 100){
		targetText = "Execution";
	}
	setText(GUI.coefficientText, value, 80, function(){
		if(value >= 100){
			runOnUiThread(function(){
				enforcementWindow.showAtLocation(ctx.getWindow().getDecorView(), android.view.Gravity.BOTTOM | android.view.Gravity.RIGHT, 0, 0);
			});
		}
		setText(GUI.targetText, targetText, 40, after);
	});

}

void(attackHook); void(deathHook); void(entityAddedHook); void(entityRemovedHook); void(newLevel); void(leaveGame); void(modTick);
