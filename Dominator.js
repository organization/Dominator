/**
 * PSYCHO-PASS: Dominator with ModPE by @onebone <jyc0410@naver.com>, @Khinenw <helloworld01017@gmail.com>
 * Do not distribute without permission.
 * (c) onebone 2015
 */


"use strict"

var entityType = [];
entityType[10] = {name:"chicken", cc:30};
entityType[11] = {name:"cow", cc:30};
entityType[12] = {name:"pig", cc:30};
entityType[13] = {name:"sheep", cc:30};
entityType[14] = {name:"wolf", cc:30};
entityType[15] = {name:"villager", cc:30};
entityType[16] = {name:"mushroom", cc:30};
entityType[32] = {name:"zombie", cc:145};
entityType[33] = {name:"creeper", cc:145};
entityType[34] = {name:"skeleton", cc:145};
entityType[35] = {name:"spider", cc:145};
entityType[36] = {name:"zombie pig", cc:145};
entityType[37] = {name:"slime", cc:145};
entityType[38] = {name:"enderman", cc:145};
entityType[39] = {name:"silver fish", cc:145};
entityType[65] = {name:"Primed TNT", cc:"A+"};
entityType[80] = {name:"arrow", cc:"A+"};

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
var Screen = {};
var GUI = {};
var Location = {};

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
		
		//var v = new android.view.View(ctx){};
		
		
		/*var bitmap = android.graphics.BitmapFactory.decodeFile(dataFolder.getAbsolutePath()+"/crime_coefficient_shower.png");
		
		GUI.image = new android.widget.ImageView(ctx);
		GUI.image.setImageBitmap(bitmap);
		
		GUI.layout.addView(GUI.image);
		
	/*	var layoutParams = new android.widget.RelativeLayout.LayoutParams(android.view.ViewGroup.LayoutParams.WRAP_CONTENT, android.view.ViewGroup.LayoutParams.WRAP_CONTENT);
		layoutParams.addRule(android.widget.RelativeLayout.CENTER_IN_PARENT);*
		
		GUI.text = new android.widget.TextView(ctx);
		GUI.text.setGravity(android.view.Gravity.LEFT);
		GUI.layout.addView(GUI.text);*/
		
		
		//GUI.progressBar = new android.widget.ProgressBar(ctx);
		//GUI.progressBar
		
		GUI.typeText = new android.widget.TextView(ctx);
		GUI.coefficientText = new android.widget.TextView(ctx);
		GUI.targetText = new android.widget.TextView(ctx);
		GUI.image = new android.widget.ImageView(ctx);
		
		//analyse Flavor
		GUI.analyse = new android.widget.TextView(ctx);
		GUI.analyseWrapper = new android.widget.RelativeLayout(ctx);
		GUI.left = new android.widget.TextView(ctx);
		GUI.progressBar = new android.widget.ProgressBar(ctx, null, android.R.attr.progressBarStyleSmall);
		GUI.right = new android.widget.TextView(ctx);
		GUI.isAnalyzing = true;
		
		GUI.analyse.setTextSize(10);
		GUI.analyse.setText("Analyse");
		GUI.analyse.setId(1);
		GUI.analyseWrapper.add(GUI.analyse);
		
		var lparams = new android.widget.RelativeLayout.LayoutParams(android.view.ViewGroup.LayoutParams.WRAP_CONTENT, android.view.ViewGroup.LayoutParams.WRAP_CONTENT);
		lparams.addRule(android.widget.RelativeLayout.BELOW, 1);
		lparams.addRule(android.widget.RelativeLayout.ALIGN_PARENT_LEFT);
		
		GUI.left.setTextSize(11);
		GUI.left.setText("[");
		GUI.left.setId(2);
		GUI.left.setLayoutParams(lparams);
		GUI.analyseWrapper.add(GUI.left);
		
		//Because the BlockLauncher doesn't support XMLs.
		var backgroundDrawable = new android.graphics.drawable.ShapeDrawable(new android.graphics.drawable.shapes.RectShape());
		var backgroundQolor = "#303030";
		backgroundDrawable.getPaint().setColor(android.graphics.Color.parseColor(backgroundQolor));
		
		var foregroundDrawable = new android.graphics.drawable.ShapeDrawable(new android.graphics.drawable.shapes.RectShape());
		var foregroundQolor = "#0080FF";
		foregroundDrawable.getPaint().setColor(android.graphics.Color.parseColor(foregroundQolor));
		/*
		//FIXME this part might have bugs.
		
		var layeredDrawable = new android.graphics.drawable.LayerDrawable([backgroundDrawable, foregroundDrawable]);
		layeredDrawable.setId(0, android.R.id.background);
		layeredDrawable.setId(1, android.R.id.progress);
		
		GUI.progressBar.setProgressDrawable(layeredDrawable);*/
		
		var pParams = new android.widget.RelativeLayout.LayoutParams(android.view.ViewGroup.LayoutParams.WRAP_CONTENT, android.view.ViewGroup.LayoutParams.WRAP_CONTENT);
		pParams.addRule(android.widget.RelativeLayout.BELOW, 1);
		pParams.addRule(android.widget.RelativeLayout.TO_LEFT, 2);
		
		GUI.progressBar.setProgressDrawable(foregroundDrawable);
		GUI.progressBar.setBackgroundDrawable(backgroundDrawable);
		GUI.progressBar.setId(3);
		GUI.progressBar.setLayoutParams(pParams);
		
		GUI.analyseWrapper.add(GUI.progressBar);
		
		var rParams = new android.widget.RelativeLayout.LayoutParams(android.view.ViewGroup.LayoutParams.WRAP_CONTENT, android.view.ViewGroup.LayoutParams.WRAP_CONTENT);
		rParams.addRule(android.widget.RelativeLayout.BELOW, 1);
		rParams.addRule(android.widget.RelativeLayout.TO_LEFT, 3);
		
		GUI.right.setTextSize(11);
		GUI.right.setText("]");
		GUI.right.setId(4);
		GUI.right.setLayoutParams(rParams);
		
		GUI.analyseWrapper.add(GUI.right);
		
		//End of Analysing Flavor
		
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

function entityAddedHook(entity){
	if(entityType[Entity.getEntityTypeId(entity)] !== undefined){
		entities.push(entity);
	}
}

function entityRemovedHook(entity){
	if(entities[entity] !== undefined){
		var index = entities.indexOf(entity);
		entities.splice(index, 1);
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
						if(entity === getPlayerEnt()) return false;
						var entityX = Entity.getX(entity);
						var entityY = Entity.getY(entity);
						var entityZ = Entity.getZ(entity);
						
						return (entityX + 1 > xx && entityX - 1 < xx) && (entityY + 1 > yy && entityY - 1) && (entityZ + 1 > zz && entityZ - 1 < zz);
					});
					if(ent.length > 0){
						entityExists = true;
						if(ent[0] !== aimedEntity){
							aimedEntity = ent[0];
							setCrimeCoefficient((entityType[Entity.getEntityTypeId(ent[0])].cc)+"", null);
						}
						break;
					}
				}
				if(!entityExists){
					if(aimedEntity !== -1){
						nonAimCnt++;
						if(nonAimCnt >= 3){
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
	//				clientMessage(entities.length);
			}
		}
	}});
	checkThr.start();
	
	ctx.runOnUiThread(new java.lang.Runnable(){
		run: function(){
	//		window.showAtLocation(ctx.getWindow().getDecorView(), android.view.Gravity.TOP | android.view.Gravity.RIGHT, Location.windowPos.x, Location.windowPos.y);//Location.centerX, Location.centerY);
			aimerWindow.showAtLocation(ctx.getWindow().getDecorView(), android.view.Gravity.TOP | android.view.Gravity.LEFT, Screen.centerX, Screen.centerY - (Screen.centerY / 8));
			//setCrimeCoefficient("127.3");
			//setText(GUI.text, "127.3", 40, null);
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
		}
	}));
	started = false;
	checkThr.stop();
}

function setText(textView, str, delay, after){
	new java.lang.Thread(new java.lang.Runnable(){
		run: function(){
			ctx.runOnUiThread(new java.lang.Runnable(){
				run: function(){
					textView.setText("");
				}
			});
			for(var i = 0; i < str.length; i++){
				ctx.runOnUiThread(new java.lang.Runnable(){
					run: function(){
						textView.append(str.charAt(i)+"");
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
				after();
			}
		}
	}).start();
}

function setCrimeCoefficient(value, after){
	ctx.runOnUiThread(new java.lang.Runnable(){
		run: function(){
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
		setText(GUI.targetText, targetText, 40, after);
	});
}
