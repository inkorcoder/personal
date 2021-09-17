function fadeInFunction(){
  if (currentScene < 4){
    camera.position.x = sceneObj.pos.x;
    camera.position.y = sceneObj.pos.y;
    camera.position.z = sceneObj.pos.z;
    camera.rotation.x = sceneObj.rot.x;
    camera.rotation.y = sceneObj.rot.y;
    camera.rotation.z = sceneObj.rot.z;
    classes = document.body.getElementsByClassName('back')[0].classList
    classes.remove(
      'fadein','slide-0','slide-1','slide-2',
      'slide-3','slide-4','slide-5','slide-6'
    );
  }
}

function fadeOutFunction(){
  if (currentScene < 4){
    classes = document.body.getElementsByClassName('back')[0].classList
    classes.remove(
      'fadein','slide-0','slide-1','slide-2',
      'slide-3','slide-4','slide-5','slide-6'
    );
    if (currentAnimDirection != 'up'){
      classes.add('fadein','slide-'+parseInt(currentScene+1));
    } else {
      classes.add('fadein','slide-'+parseInt(currentScene));
    }
  }
}

function endAnimationCallback() {
//   console.log(camera.position, camera.rotation);
  cameraCache.x = camera.position.x;
  cameraCache.z = camera.position.z;
  if (currentScene == 3){
    $('.color-block').removeClass('disabled');
    titlesLines.forEach(function(line){
      line.material.opacity = 0.2;
    });
    titles.forEach(function(title){
      title.material.opacity = 1;
    });
  }
}

function onWindowResize() {
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  cameraCube.aspect = window.innerWidth / window.innerHeight;
  cameraCube.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}

function onDocumentMouseMove(evento) {
  // mouseY = ( event.clientY - window.innerHeight );
  mouseX = ( event.clientX - window.innerWidth );
  // console.log(mouseY);
}

function scrollFunction(way){

  // currentSceneChecker();

  if (currentScene == 0){
    if (way == 'down'){
      camera.position.z -= 1;
    }else{
      camera.position.z += 1;
    }
  }
  if (currentScene == 1){
    if (way == 'down'){
      camera.position.z -= 0.3;
    }else{
      camera.position.z += 0.3;
    }
  }
  if (currentScene == 2){
    if (way == 'down'){
      camera.position.x += 1;
    }else{
      camera.position.x -= 1;
    }
  }
  if (currentScene == 3){
    if (way == 'down'){
      camera.position.z += Math.sin(currentAnimStep/2/100*(Math.PI)) * 1.6 * 3;
      camera.position.y += Math.sin(currentAnimStep/2/100*(Math.PI)) * 1.6 * 3;
      camera.rotation.x -= Math.sin(currentAnimStep/2/100*(Math.PI)) * 1.6 * 0.002;
      for (var i=0; i < titles.length; i++){
        titles[i].rotation.x -= 0.002;
      }
    }else{
      camera.position.z -= 3;
      camera.position.y -= 2;
      // camera.rotation.x += 0.0005;
    }
  }
  if (currentScene == 4){
    fadeOutFunction();
  }
}
var current = 0;
var current2 = 0;
var lastY = 0;
var lastPos, lastPos2, lastPos3;
var zoom = 1000;
var pageX;

var lastCoords = [0,0];

function rotate(angle){
  camera.position.x = Math.sin((lastPos2 + (event.pageX - current2))/100) * 900;
  camera.position.z = Math.cos((lastPos2  + (event.pageX - current2))/100) * 900;
}

function moveHandler(event){
  // console.log(event.pageY, event.pageX);
  // current += event.pageY;
  camera.position.y = lastPos + (event.pageY - current);
  if (camera.position.y < 30){
    camera.position.y = 30;
  }
  pageX = event.pageX;
  camera.position.x = Math.sin((lastPos2 + (pageX - current2))/100) * 1000;
  camera.position.z = Math.cos((lastPos2 + (pageX - current2))/100) * 1000;
  // rotate(0);
  // lastCoords[0] = Math.sin((lastPos2 + (event.pageX - current2))/100);
  // lastCoords[1] = Math.cos((lastPos2 + (event.pageX - current2))/100);
  // camera.position.x = Math.cos(current) * 1000;
  // camera.position.z = Math.sin(current) * 1000;
}

function featuresIn(){
  titlesLines.forEach(function(line){
    // line.scale.set(1,1,1);
    // line.material.opacity = 1;
    // line.material.opacity = 0;
  });
}
function featuresOut(){
  titlesLines.forEach(function(line){
    // line.scale.set(0.0001,0.0001,0.0001);
    // line.material.opacity = 0;
    // line.material.opacity = 0;
  });
}


var SCROLL = 0;
$(document).ready(function(){
  $(document).mousewheel(function(event){
    if (event.deltaY > 0) {
      if (!isAnim && currentScene > 0){
        currentAnimDirection = 'up';
        isAnim = true;
      }
      if (currentScene == 4 && zoom > 700){
        zoom -= 100;
        // camera.position.x = lastCoords[0] * zoom;
        // camera.position.y = lastCoords[1] * zoom;
      }
    }else{
      if (!isAnim && currentScene < scenes.length-1){
        currentAnimDirection = 'down';
        isAnim = true;
      }
      if (currentScene == 4 && zoom < 3000){
        zoom += 100;
        // camera.position.x = lastCoords[0] * zoom;
        // camera.position.y = lastCoords[1] * zoom;
      }
    }
  });

  $(document).mousedown(function(event){
    current = event.pageY;
    lastPos = camera.position.y;
    current2 = event.pageX;
    lastPos2 = event.pageX;
    lastPos3 = camera.position.z;
    if (currentScene == 7){
      $('body').addClass('moved');
      $('body').bind('mousemove', moveHandler);
    }
  });

  $(document).mouseup(function(event){
    $('body').removeClass('moved');
    $('body').unbind('mousemove', moveHandler);
  });

  $(document).mouseout(function(event){
    $('body').removeClass('moved');
    $('body').unbind('mousemove', moveHandler);
  });

  $(document).mousemove(function(event){
    // event.pageY;
    // cameraCache.position
    if (cameraCache.x != undefined && currentScene >= 4 && !featuresAnimation){
      camera.position.x = cameraCache.x + (event.pageX - window.innerWidth/2)/15;
      camera.position.z = cameraCache.z + (event.pageY - window.innerHeight/2)/15;
    }
  });


  $('.back-link').click(function(e){
    e.preventDefault();
    $(this).removeClass('active');
    featuresAnimation = true;
    featuresDirection = 1;
  });

  $('.select-device').mousemove(function(event){
    // event.pageX
    $('.select-device .fast')
      .css('left', (event.pageX/window.innerWidth*100)+'%');
      // .css('transform', 'translateX('+(event.pageX - window.innerWidth/2)+'px)');
  });
  $('#slow').click(function(e){
    e.preventDefault();
    $('.select-device').addClass('disabled');
    $('.loader').removeClass('disabled');
    setTimeout(function(){
      init('slow');
      animate();
    }, 1000);
  });
  $('#fast').click(function(e){
    e.preventDefault();
    $('.select-device').addClass('disabled');
    $('.loader').removeClass('disabled');
    setTimeout(function(){
      init('fast');
      animate();
    }, 1000);
  });

  $('.color-block ul li').click(function(e){
    e.preventDefault();
    CAR.materials.body[4][1].color  =  new THREE.Color( '#'+$(this).data('color') );
  });

});