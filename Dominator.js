/**
 * PSYCHO-PASS: Dominator with ModPE by @onebone <jyc0410@naver.com>, @Khinenw <helloworld01017@gmail.com>
 * Do not distribute without permission.
 * (c) onebone 2015
 */


"use strict"

var entityType = [];
entityType[10] = {name:"chicken", cc:75};
entityType[11] = {name:"cow", cc:87};
entityType[12] = {name:"pig", cc:64};
entityType[13] = {name:"sheep", cc:47};
//양을 먹으므로 범죄계수 상승
entityType[14] = {name:"wolf", cc:113};
entityType[15] = {name:"villager", cc:-1};
entityType[16] = {name:"mushroom", cc:30};
entityType[32] = {name:"zombie", cc:304};
entityType[33] = {name:"creeper", cc:562};
entityType[34] = {name:"skeleton", cc:486};
entityType[35] = {name:"spider", cc:312};
entityType[36] = {name:"zombie pig", cc:436};
entityType[37] = {name:"slime", cc:180};
entityType[38] = {name:"enderman", cc:497};
entityType[39] = {name:"silver fish", cc:253};
entityType[65] = {name:"Primed TNT", cc:"A+"};
entityType[80] = {name:"arrow", cc:"A+"};

var Target = function(t, entityId){
	this.type = t;
	this.eid = entityId;
	this.cc = entityType[t].cc;
};

Target.prototype = {};

Target.prototype.getCrimeCoefficient = function(){
	var value = 0;
	
	if(this.cc === -1){
		value = Math.floor(Math.random() * 400);
	}
	
	if(this.cc === "A+"){
		return this.cc;
	}
	
	value = Math.max(0, this.cc + Math.floor(Math.random() * 30) - 15);
	
	var worldTime = Level.getTime();
	
	while(worldTime > 24000){
		worldTime -= 24000;
	}
	
	if(worldTime > 14000){
		return value + 100;
	}else{
		return value;
	}
};

Target.prototype.getColor = function(){
	var rand = new java.lang.Random();
	var r = rand.nextInt(255);
	var g = rand.nextInt(255);
	var b = rand.nextInt(255);
	if(cc === "A+"){
		return android.graphics.Color.parseColor("#00000000");
	}
	
	r -= cc / 3;
	g -= cc / 3;
	b -= cc / 3;
	
	if(r < 0){
		r = 0;
	}
	
	if(g < 0){
		g = 0;
	}
	
	if(b < 0){
		b = 0;
	}
	return android.graphics.Color.rgb(r, g, b);
};

Target.prototype.setCCoefficient = function(coefficient){
	this.cc = coefficient;
}

Target.prototype.getId = function(){
	return this.eid;
};

var started = false;
var aimedEntity = -1;
var nonAimCnt = 0;
var entities = [];

var checkThr = null;

var ctx = com.mojang.minecraftpe.MainActivity.currentMainActivity.get();

var sdcard = android.os.Environment.getExternalStorageDirectory();
var dataFolder = new java.io.File(sdcard, "Dominator");

var blinkColor = android.graphics.Color.rgb(3, 147, 216);

var window = null;
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

//dominator cooltime
var domTimer = 0;
var reqDomTimer = 100;

//NON LETHAL PARALYZER FUNCTION

//마비 시간
var reqParalyzedTimer = 500;

var paralyzerEntity = [];
// {entity, x, y, z, time}

//개발자 기능(테스트용)
var isSibylHacked =  false;

ModPE.setItem(472,"record_chirp",0,"도미네이터");
	
new java.lang.Thread({run:function(){
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
	
	ctx.runOnUiThread(new java.lang.Runnable({run: function(){
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
		GUI.progressBar.setOnTouchListener(new android.view.View.OnTouchListener(){
			onTouch: function(v, e){
				return false;
			}
		});
		
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
		
		GUI.enforcementButton.setText("D");
		GUI.enforcementButton.setOnClickListener(new android.view.View.OnClickListener(){
			onClick : function(v){
				var yaw = Math.floor(getYaw());
				var pitch = Math.floor(getPitch());
				var sin = -Math.sin(yaw/180 * Math.PI);
				var cos = Math.cos(yaw/180*Math.PI);
				var tan = -Math.sin(pitch/180*Math.PI);
				var pcos = Math.cos(pitch/180*Math.PI);
				
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
						
						return (entityX + 1 > xx && entityX - 1 < xx) && (entityY + 1 > yy && entityY - 1) && (entityZ + 1 > zz && entityZ - 1 < zz);
					});
					if(ent.length > 0){
						enforce(ent[0].getCrimeCoefficient(), ent[0]);
						break;
					}
				}
			}
		});
		GUI.enforcementWrapper.addView(GUI.enforcementButton);
		
		enforcementWindow = new android.widget.PopupWindow(GUI.enforcementWrapper);
		enforcementWindow.setWindowLayoutMode(android.view.ViewGroup.LayoutParams.WRAP_CONTENT, android.view.ViewGroup.LayoutParams.WRAP_CONTENT);
		//End of enforcement Flavor
		
		var bitmap = getBitmap();
		
		GUI.image.setImageBitmap(bitmap);
		GUI.image.setOnTouchListener(new android.view.View.OnTouchListener(){
			onTouch: function(v, e){
				return false;
			}
		});
		
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
		
		window = new android.widget.PopupWindow(GUI.layout);
		window.setFocusable(false);
		window.setTouchable(false);
		window.setWindowLayoutMode(android.view.ViewGroup.LayoutParams.WRAP_CONTENT, android.view.ViewGroup.LayoutParams.WRAP_CONTENT);
		
		var aimLayout = new android.widget.RelativeLayout(ctx);
		var imageView = new android.widget.ImageView(ctx);
		
		var aimBitmap = new android.graphics.Bitmap.createBitmap(60, 60, android.graphics.Bitmap.Config.ARGB_8888);
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
	}}));
}}).start();


function findTarget(entity){
	for(var target in entities){
		if(entities[target].getId() === entity){
			return entities[target];
		}
	}
}

function entityAddedHook(entity){
	if(entityType[Entity.getEntityTypeId(entity)] !== undefined){
		//entities.push(entity);
		entities[entity] = new Target(Entity.getEntityTypeId(entity), entity);
	}
}


function deathHook(murderer, victim){
	if(victim == getPlayerEnt()){
		findTarget(murderer).setCCoefficient("A+");
	}else{
		var murdererEnt = findTarget(murderer);
		if(murdererEnt.getCrimeCoefficient() !== "A+") murdererEnt.setCCoefficient(murdererEnt.getCrimeCoefficient() + 100);
		if(aimedEntity == murdererEnt.getId()) setCrimeCoefficient(murdererEnt.getCrimeCoefficient);
	}
}

function attackHook(attacker, victim){
	if(victim == getPlayerEnt()){
		findTarget(attacker).setCCoefficient("A+");
	}else{
		var attackerEnt = findTarget(attacker);
		if(attackerEnt.getCrimeCoefficient() !== "A+") attackerEnt.setCCoefficient(attackerEnt.getCrimeCoefficient() + 100);
		if(aimedEntity == attackerEnt.getId()) setCrimeCoefficient(attackerEnt.getCrimeCoefficient);
	}
}

function entityRemovedHook(entity){
	if(entities[entity] !== undefined){
		/*var index = entities.indexOf(entity);
		entities.splice(index, 1);*/
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
	ctx.runOnUiThread(new java.lang.Runnable(){
		run: function(){
			GUI.typeText.setText("CRIME COEFFICIENT");
			GUI.coefficientText.setText("");
			GUI.targetText.setText("");
		}
	});
	
	canvas.drawText("TARGET", Location.centerX, Location.centerY + 70, textPaint);
	canvas.drawCircle(Location.centerX - 10, Location.centerY + 10, 185, paint);
	canvas.drawCircle(Location.centerX,		 Location.centerY,		200, paint);
	
	return bitmap;
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

function drawProgress(progressPercentage, bitmap){
	
	var clonedBitmap = android.graphics.Bitmap.createBitmap(bitmap);
	
	var canvas = new android.graphics.Canvas(clonedBitmap);
	
	var fgPaint = new android.graphics.Paint();
	fgPaint.setColor(blinkColor);
	
	wholeSize = 380 * progressPercentage / 100;
	
	canvas.drawRect(60, 35, 60 + wholeSize, 70, fgPaint);
	
	return clonedBitmap;
}

function newLevel(hasLevel){
	started = true;
	checkThr = new java.lang.Thread({run: function(){
		while(true){
			if(started){
				var yaw = Math.floor(getYaw());
				var pitch = Math.floor(getPitch());
				var sin = -Math.sin(yaw/180 * Math.PI);
				var cos = Math.cos(yaw/180*Math.PI);
				var tan = -Math.sin(pitch/180*Math.PI);
				var pcos = Math.cos(pitch/180*Math.PI);
				
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
						
						return (entityX + 1 > xx && entityX - 1 < xx) && (entityY + 1 > yy && entityY - 1) && (entityZ + 1 > zz && entityZ - 1 < zz);
					});
					if(ent.length > 0){
						entityExists = true;
						
						if(ent[0].getId() !== aimedEntity){
							if(window !== null){
								ctx.runOnUiThread(new java.lang.Runnable(){
									run: function(){
										window.dismiss();
									}
								});
							}
							aimedEntity = ent[0].getId();
							var value = entities[aimedEntity].getCrimeCoefficient();//entityType[Entity.getEntityTypeId(ent[0])].cc;
						/*	if(value === -1){
								value = whatColor();
							}else{
								value = getCrimeCoefficient(value);
							}*/
							setCrimeCoefficient(value + "", null);
						}
						break;
					}
				}
				if(!entityExists){
					if(aimedEntity !== -1){
						nonAimCnt++;
						if(nonAimCnt >= 2){
							if(window !== null){
								ctx.runOnUiThread(new java.lang.Runnable(){
									run: function(){
										window.dismiss();
									}
								});
							}
							nonAimCnt = 0;
							aimedEntity = -1;
						}
					}
				}
				try{
					java.lang.Thread.sleep(500);
				}catch(e){}
			}
		}
	}});
	checkThr.start();
	
	ctx.runOnUiThread(new java.lang.Runnable(){
		run: function(){
			aimerWindow.showAtLocation(ctx.getWindow().getDecorView(), android.view.Gravity.TOP | android.view.Gravity.LEFT, Screen.centerX, Screen.centerY - (Screen.centerY / 8));
		}
	});
}

function leaveGame(){	
	ctx.runOnUiThread(new java.lang.Runnable({
		run: function(){
			if(window !== null){
				window.dismiss();
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
		}
	}));
	started = false;
}

function setText(textView, str, delay, after){
	new java.lang.Thread(new java.lang.Runnable(){
		run: function(){
			ctx.runOnUiThread(new java.lang.Runnable(){
				run: function(){
					textView.setText("");
				}
			});
			var text = "";
			for(var i = 0; i < str.length; i++){
				text += (str.charAt(i)+"");
				ctx.runOnUiThread(new java.lang.Runnable(){
					run: function(){
						textView.setText(text);
					}
				});
				try{
					java.lang.Thread.sleep(delay);
				}catch(e){}
			}
			ctx.runOnUiThread(new java.lang.Runnable(){
				run: function(){
					textView.setBackgroundColor(blinkColor);
				}
			});
			try{
				java.lang.Thread.sleep(80);
			}catch(e){}
			ctx.runOnUiThread(new java.lang.Runnable(){
				run: function(){
					textView.setBackgroundColor(android.graphics.Color.TRANSPARENT);
				}
			});
			if(after !== null){
				after.run();
			}
		}
	}).start();
}

function enforce(cc, target){
	if(cc === "A+"){
		destroyDecompose(target);
		return;
	}
	
	if(cc < 100){
		return;
	}else if(cc < 300){
		paralyze(target);
	}else if(300 <= cc){
		eliminate(target);
	}
}

function paralyze(target){
	paralyzerEntity.push({entity:target, x:Entity.getX(target.getId()), y:Entity.getY(target.getId()), z:Entity.getZ(target.getId), time:0});
}

function eliminate(target){
}

function destroyDecompose(target){
}

function modTick(){
	for(var target in paralyzerEntity){
		if(!target) continue;
		
		Entity.setPosition(paralyzerEntity[target].entity.getId(), paralyzerEntity[target].x, paralyzerEntity[target].y, paralyzerEntity[target].z);
		paralyzerEntity[target].time--;
		if(paralyzerEntity[target].time <= 0){
			delete paralyzerEntity[target];
		}
	}
}

function setCrimeCoefficient(value, after){

	ctx.runOnUiThread(new java.lang.Runnable(){
		run: function(){
			showProgress(10);
		}
	});
	try{
		java.lang.Thread.sleep(1000);
	}catch(e){
		
	}
	ctx.runOnUiThread(new java.lang.Runnable(){
		run: function(){
			if(progressWindow !== null){
				progressWindow.dismiss();
			}
			window.showAtLocation(ctx.getWindow().getDecorView(), android.view.Gravity.TOP | android.view.Gravity.RIGHT, Location.windowPos.x, Location.windowPos.y);
			GUI.typeText.setText("CRIME COEFFICIENT");
			GUI.targetText.setText("");
			GUI.coefficientText.setText("");
		}
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
		return;
	}
	if(value >= 100){
		targetText = "Execution";
	}
	setText(GUI.coefficientText, value, 80, function(){
		ctx.runOnUiThread(new java.lang.Runnable(){
			run: function(){
				enforcementWindow.showAtLocation(ctx.getWindow().getDecorView(), android.view.Gravity.BOTTOM | android.view.Gravity.RIGHT, 0, 0);
			}
		});
		setText(GUI.targetText, targetText, 40, after);
	});

}

function showProgress(delay){
	GUI.isAnalyzing = true;
	GUI.progressBar.setImageBitmap(progressBitmap);
	progressWindow.showAtLocation(ctx.getWindow().getDecorView(), android.view.Gravity.TOP | android.view.Gravity.RIGHT, Location.windowPos.x, Location.windowPos.y);//Screen.centerX, Screen.centerY - (Screen.centerY / 8));
	new java.lang.Thread(new java.lang.Runnable(){
		run : function(){
			for(var i = 0; i <= 100; i++){
				ctx.runOnUiThread(new java.lang.Runnable(){
					run: function(){
						GUI.progressBar.setImageBitmap(drawProgress(i, progressBitmap));
					}
				});
				try{
					java.lang.Thread.sleep(delay);
				}catch(e){
					
				}
			}
			GUI.isAnalyzing = false;
		}
	}).start();
}