class Viewer {
  constructor (cube) {
    this.elem = document.createElement('div');
    this.elem.classList.add('viewer-container')
    document.querySelector('#all-viewers-container').appendChild(this.elem);

    this.camera=new THREE.PerspectiveCamera(35, 1, 1, 10000);
    this.camera.position.set(150, 60, 150);
    this.scene=new THREE.Scene();

    // object
    var loader=new THREE.STLLoader();
    loader.load(`/stl/${cube.filename}`, ( geometry ) => {
      var material = new THREE.MeshPhongMaterial({ 
        wireframe: false, 
        color: 0xff00ff, 
        specular: 0xffffff, 
        shininess: 1, 
        flatShading: THREE.FlatShading  
      });
      this.object = new THREE.Mesh( geometry, material )
      this.object.scale.set(5, 5, 5);
      this.object.position.set(-10 ,0, -10);
      //this.object.rotation.x  = Math.PI / 4;
      this.scene.add( this.object );
    });
  
    // lights
    this.scene.add(new THREE.AmbientLight(0x736F6E));

    var directionalLight=new THREE.DirectionalLight(0xffffff, 1);
    //directionalLight.position=this.camera.position;
    this.scene.add(directionalLight);

    // renderer

    this.renderer=new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(300, 300);

    this.elem.appendChild(this.renderer.domElement);

    window.addEventListener('resize', this.onWindowResize.bind(this), false);
    
  }

  onWindowResize(){
    /*this.camera.aspect=1;//window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(100, 100);*/
  }

  addLight(x, y, z, color, intensity) {
    var directionalLight=new THREE.DirectionalLight(color, intensity);
    directionalLight.position.set(x, y, z)
    this.scene.add(directionalLight);
  }
  
  render() {
    if (!this.object) {
      return;
    }
    var timer=Date.now() * 0.002;
    let r = 70
    this.camera.position.x=r*Math.cos(timer);
    this.camera.position.z=r*Math.sin(timer);
    //this.camera.position.x=0;
    //  this.camera.position.z=r;
    //this.object.rotation.y = timer % (2 * Math.PI);
    this.camera.lookAt(this.scene.position);
    this.renderer.render(this.scene, this.camera);
    this.renderer.setClearColor(0xf5f5f5, 1);
  }

}