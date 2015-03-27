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

var TargetType = {
    HOSTILE: 0,
    MOB: 1,
    OBJECT: 2
};

var entityType = [];
entityType[10] = {name: "Chicken",    cc: 75,   type: TargetType.MOB};
entityType[11] = {name: "Cow",        cc: 87,   type: TargetType.MOB};
entityType[12] = {name: "Pig",        cc: 64,   type: TargetType.MOB};
entityType[13] = {name: "Sheep",      cc: 47,   type: TargetType.MOB};
entityType[14] = {name: "Wolf",       cc: 113,  type: TargetType.HOSTILE}; //CC is increased because they attacks sheep
entityType[15] = {name: "Villager",   cc: -1,   type: TargetType.MOB};
entityType[16] = {name: "Mooshroom",  cc: 30,   type: TargetType.MOB};
entityType[32] = {name: "Zombie",     cc: 304,  type: TargetType.HOSTILE};
entityType[33] = {name: "Creeper",    cc: 562,  type: TargetType.HOSTILE};
entityType[34] = {name: "Skeleton",   cc: 486,  type: TargetType.HOSTILE};
entityType[35] = {name: "Spider",     cc: 312,  type: TargetType.HOSTILE};
entityType[36] = {name: "Pig zombie", cc: 436,  type: TargetType.HOSTILE};
entityType[37] = {name: "Slime",      cc: 180,  type: TargetType.HOSTILE};
entityType[38] = {name: "Enderman",   cc: 497,  type: TargetType.HOSTILE};
entityType[39] = {name: "Silverfish", cc: 253,  type: TargetType.HOSTILE};
entityType[65] = {name: "Primed TNT", cc: "A+", type: TargetType.OBJECT};
entityType[80] = {name: "Arrow",      cc: "A+", type: TargetType.OBJECT};

/**
 * @param {number} entityTypeId
 * @param {number} entityId
 * @constructor
 */
function Target(entityTypeId, entityId){
	this.eid = entityId;
	this.cc = entityType[entityTypeId].cc;
	this.type = entityType[entityTypeId].type;

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
	var maxChange = (now - this.lastCheck) / 60000;

    value = Math.max(0, this.cc + Math.floor(Math.random() * maxChange) - (maxChange / 2));

    var worldTime = Level.getTime();

    worldTime = worldTime % 24000;

    this.cc = value;

    value = Math.round(value);
	return value + ((worldTime > 14000 && this.type !== TargetType.HOSTILE) ? 100 : 0); // TODO: Change this value sometime whenever in future
};

Target.prototype.getColor = function(){
    if(this.cc === "A+"){
        return android.graphics.Color.parseColor("#00000000");
    }

    return this.color;
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
	this.check = true;
	this.checkingLoop = null;
	this.aimedEntity = -1;
	this.nonAimCnt = 0;
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
		that.coefficientImage = new android.widget.ImageView(ctx);
		that.coefficientImage.setImageBitmap(that.prepareBitmap());
		
		that.coefficientWrapper.addView(that.coefficientImage);
		that.coefficientWrapper.addView(that.typeText);
		that.coefficientWrapper.addView(that.coefficientText);
		that.coefficientWrapper.addView(that.targetText);
		
		that.progressWrapper = new android.widget.RelativeLayout(ctx);
		that.progressBar = new android.widget.ImageView(ctx);
		that.progressWrapper.addView(that.progressBar);
		
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
};

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

Dominator.prototype.prepareBitmap = function(){
    var that = this;

	runOnUiThread(function(){
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
		
		var bitmap = android.graphics.Bitmap.createBitmap(550, 410, android.graphics.Bitmap.Config.ARGB_8888); // TODO: consider the pixels of phone
		var canvas = new android.graphics.Canvas(bitmap);
		canvas.drawRect(Location.centerX, Location.centerY - 100, Location.centerX + 350, Location.centerY - 60, rectP);
		canvas.drawRect(Location.centerX, Location.centerY + 35,  Location.centerX + 350, Location.centerY + 75, rectP);
		
		that.typeText.setX(Location.centerX); // TODO: consider the pixels of phone
		that.typeText.setY(Location.centerY - 100);
		that.coefficientText.setX(Location.centerX);
		that.coefficientText.setY(Location.centerY - 65);
		that.targetText.setX(Location.centerX);
		that.targetText.setY(Location.centerY + 70);
		
		that.typeText.setText("CRIME COEFFICIENT");
		that.coefficientText.setText("");
		that.targetText.setText("");
	
		canvas.drawText("TARGET", Location.centerX, Location.centerY + 70, textPaint);
		canvas.drawCircle(Location.centerX - 10, Location.centerY + 10, 185, paint);
		canvas.drawCircle(Location.centerX,		 Location.centerY,		200, paint);
		
		return bitmap;
	});
};

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
			for(var i = 0; i <= 100; i++){
				runOnUiThread(function(){
					//noinspection JSReferencingMutableVariableFromClosure
                    that.progressBar.setImageBitmap(drawProgress(i, that.progressBitmap));
				});
				try{
					java.lang.Thread.sleep(10);
				}catch(e){}
			}
			runOnUiThread(function(){
				that.progressWrapper.setVisibility(android.view.View.INVISIBLE);
				that.coefficientWrapper.setVisibility(android.view.View.VISIBLE);
				
				if(value === "A+"){ // TODO: Enforce button
					setText(that.coefficientText, "Not measure", 40, function(){
						setText(that.typeText, "THREAT STATUS", 40, function(){
							setText(that.coefficientText, value, 80, null);
						});
						setText(that.targetText, "Eliminate Target", 40, null);
					});
				}else{
					var target = (value >= 100 ? "Execution" : "Not Target");
					setText(that.coefficientText, value, 80, function(){
						setText(that.targetText, target, 40, null);
					});
				}
			});
		});
	});
};

Dominator.prototype.startChecking = function(){
	if(this.checkingLoop !== null){
		this.checkingLoop.kill();
	}
	var that = this;
	
	this.checkingLoop = new Loop(function(){
        var yaw = Math.floor(Entity.getYaw(Player.getEntity()));
        var pitch = Math.floor(Entity.getPitch(Player.getEntity()));
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

                if(ent[0].getId() !== that.aimedEntity){
                    if(that.popupWindow !== null){
                        runOnUiThread(function(){
                            that.popupWindow.dismiss();
                        });
                    }
					that.aimedEntity = ent[0].getId();
                    var value = entities[that.aimedEntity].getCrimeCoefficient();
                    that.showCoefficient(value + "");
                }else if(ent[0].getId() === that.aimedEntity){
					setText(that.coefficientText, ent[0].getCrimeCoefficient(), 80, null);
				}
                break;
            }
        }
        if(!entityExists){
            if(that.aimedEntity !== -1){
                that.nonAimCnt++;
                if(that.nonAimCnt >= 2){
                    if(popupWindow !== null){
                        runOnUiThread(function(){
                            popupWindow.dismiss();
                            if(enforcementWindow != null){
                                enforcementWindow.dismiss();
                            }
                        });
                    }
                    that.nonAimCnt = 0;
                    that.aimedEntity = -1;
                }
            }
        }

    }, 500);
	this.checkingLoop.start();
};

Dominator.prototype.stopChecking = function(){
	if(this.checkingLoop !== null){
		this.checkingLoop.kill();
		return true;
	}
	return false;
};

Dominator.prototype.enforce = function(entity){ //FIXME: Unused parameter "entity"
	runOnThread(function(){
		var yaw = Math.floor(Entity.getYaw(Player.getEntity()));
		var pitch = Math.floor(Entity.getPitch(Player.getEntity()));
		var sin = -Math.sin(yaw / 180 * Math.PI);
		var cos = Math.cos(yaw / 180 * Math.PI);
		var tan = -Math.sin(pitch / 180 * Math.PI);
		var pcos = Math.cos(pitch / 180 * Math.PI);

		var x = Player.getX();
		var y = Player.getY();
		var z = Player.getZ();

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
	});
};

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

var aimingWindow = null;
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

//dominator cooltime
var domTimer = 0;
var reqDomTimer = 100;

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
	
	runOnUiThread(function(){ // TODO: Remove code below here
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
            var yaw = Math.floor(Entity.getYaw(Player.getEntity()));
            var pitch = Math.floor(Entity.getPitch(Player.getEntity()));
            var sin = -Math.sin(yaw / 180 * Math.PI);
            var cos = Math.cos(yaw / 180 * Math.PI);
            var tan = -Math.sin(pitch / 180 * Math.PI);
            var pcos = Math.cos(pitch / 180 * Math.PI);

            var x = Player.getX();
            var y = Player.getY();
            var z = Player.getZ();

            for(var cnt = 0; cnt < 50; cnt++){
                var xx = x + (0.4 + cnt) * sin * pcos;
                var yy = y + (0.4 + cnt) * tan;
                var zz = z + (0.4 + cnt) * cos * pcos;

                var ent = entities.filter(function(entity){
                    if(entity.getId() === Player.getEntity()){
                        return false;
                    }
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

        var bitmap = getBitmap(); //FIXME: The method "getBitmap" is undefined!

        GUI.image.setImageBitmap(bitmap);
        GUI.image.setOnTouchListener(createOnTouchListener(function(){
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

        aimingWindow = new android.widget.PopupWindow(aimLayout);
        aimingWindow.setTouchable(false);
        aimingWindow.setWindowLayoutMode(android.view.ViewGroup.LayoutParams.WRAP_CONTENT, android.view.ViewGroup.LayoutParams.WRAP_CONTENT);
    });
});

function entityAddedHook(entity){
    if(entityType[Entity.getEntityTypeId(entity)] !== undefined){
        entities[entity] = new Target(Entity.getEntityTypeId(entity), entity);
    }
}

function deathHook(murderer, victim){
    var murdererEnt = entities[murderer];

    if(murdererEnt == undefined){
        return;
    }

    if(victim == Player.getEntity()){
        murdererEnt.cc = "A+";
    }else{
        if(murdererEnt.getCrimeCoefficient() !== "A+") murdererEnt.cc += 300;
        if(aimedEntity == murderer) setText(GUI.coefficientText, murdererEnt.getCrimeCoefficient(), 80, null);
    }
}

function attackHook(attacker, victim){
    var attackerEnt = entities[attacker];
    var victimEnt = entities[victim];

    if(victim == Player.getEntity()){
        if(attackerEnt == undefined) return;
        attackerEnt.cc = "A+";
        if(aimedEntity == attacker) setText(GUI.coefficientText, "A+", 80, null);
    }else{

        if(attackerEnt !== undefined && (attackerEnt.getCrimeCoefficient() !== "A+")) attackerEnt.cc += 100;

        if(victimEnt !== undefined){
            victimEnt.cc += 50;
        }

        if(aimedEntity == victim) setText(GUI.coefficientText, victimEnt.getCrimeCoefficient(), 80, null);
        if(aimedEntity == attacker) setText(GUI.coefficientText, attackerEnt.getCrimeCoefficient(), 80, null);
    }
}

function entityRemovedHook(entity){
    if(entities[entity] !== undefined){
        delete entities[entity];
    }
}

function newLevel(){
	runOnUiThread(function(){
		aimingWindow.showAtLocation(ctx.getWindow().getDecorView(), android.view.Gravity.CENTER, 0, 0);
	});
}

function leaveGame(){
    runOnUiThread(function(){
        if(popupWindow !== null){
            popupWindow.dismiss();
        }
        if(aimingWindow !== null){
            aimingWindow.dismiss();
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
    if(domTimer < reqDomTimer){
        return;
    }

    domTimer = 0;

    if(leftDestroy <= 0){
        return;
    }

    leftDestroy--;

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
                Level.setTile(orX + (regX - hSize), orY + (regY - hSize), orZ + (regZ - hSize), blockId, damage);
            }
        }
    }

    var cnt = 0;

    var irregularX;
    var irregularY;
    var irregularZ;

    var irregularHSize;

    for(var irregularSize = size - 2; irregularSize > 0; irregularSize -= 2){

        var irregularOffset = hSize + cnt + 1;
        irregularHSize = Math.floor(irregularSize / 2);

        //up and down
        for(irregularX = 0; irregularX < irregularSize; irregularX++){
            for(irregularZ = 0; irregularZ < irregularSize; irregularZ++){
                Level.setTile(orX + (irregularX - irregularHSize), orY - irregularOffset, orZ + (irregularZ - irregularHSize), blockId, damage);
                Level.setTile(orX + (irregularX - irregularHSize), orY + irregularOffset, orZ + (irregularZ - irregularHSize), blockId, damage);
            }
        }

        //left and right
        for(irregularX = 0; irregularX < irregularSize; irregularX++){
            for(irregularY = 0; irregularY < irregularSize; irregularY++){
                Level.setTile(orX + (irregularX - irregularHSize), orY + (irregularY - irregularHSize), orZ - irregularOffset, blockId, damage);
                Level.setTile(orX + (irregularX - irregularHSize), orY + (irregularY - irregularHSize), orZ + irregularOffset, blockId, damage);
            }
        }

        //front and back
        for(irregularZ = 0; irregularZ < irregularSize; irregularZ++){
            for(irregularY = 0; irregularY < irregularSize; irregularY++){
                Level.setTile(orX - irregularOffset, orY + (irregularY - irregularHSize), orZ + (irregularZ - irregularHSize), blockId, damage);
                Level.setTile(orX + irregularOffset, orY + (irregularY - irregularHSize), orZ + (irregularZ - irregularHSize), blockId, damage);
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
    if(domTimer < reqDomTimer){
        domTimer++;
    }

    for(var i = 0; i < paralyzerEntity.length; i++){
        Entity.setPosition(paralyzerEntity[i].entity.getId(), paralyzerEntity[i].x, paralyzerEntity[i].y, paralyzerEntity[i].z);
        paralyzerEntity[i].time--;

        if(paralyzerEntity[i].time <= 0){
            delete paralyzerEntity[i];
        }
    }
}

function setCrimeCoefficient(value, after){

    GUI.isAnalyzing = true;
    runOnUiThread(function(){
            showProgress(10); //FIXME: Unresolved function (Is it member of Dominator?)
    });
    while(GUI.isAnalyzing){}

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

/** Color fade out to white function
 * @param {int} r - The start color's red value
 * @param {int} g - The start color's green value
 * @param {int} b - The start color's blue value
 * @param {number} progress - The progress of the animation. (0 to 100)
 */
function animateWhiteFade(r, g, b, progress){
    r += (progress / 100 * (255 - r));
    g += (progress / 100 * (255 - g));
    b += (progress / 100 * (255 - b));

    return android.graphics.Color.rgb(r, g, b);
}

function drawFadeAnimation(bitmap, paint){
    var canvas = new android.graphics.Canvas(bitmap);
    canvas.drawRect(60, 35, 440, 70, paint);

    return bitmap;
}

void(attackHook); void(deathHook); void(entityAddedHook); void(entityRemovedHook); void(newLevel); void(leaveGame); void(modTick);