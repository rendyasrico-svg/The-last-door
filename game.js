import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

/* =========================================================
   THE LAST DOOR
   MOBILE OPTIMIZED - FIXED VERSION
========================================================= */


/* =========================================================
   HTML ELEMENTS
========================================================= */

const container = document.getElementById("game-container");

const splashScreen = document.getElementById("splash-screen");
const tapToPlay = document.getElementById("tap-to-play");

const startScreen = document.getElementById("start-screen");
const difficultyScreen = document.getElementById("difficulty-screen");
const optionsScreen = document.getElementById("options-screen");
const howScreen = document.getElementById("how-screen");
const creditsScreen = document.getElementById("credits-screen");

const startBtn = document.getElementById("start-btn");
const optionsBtn = document.getElementById("options-btn");
const howBtn = document.getElementById("how-btn");
const creditsBtn = document.getElementById("credits-btn");

const joystick = document.getElementById("joystick");
const stick = document.getElementById("stick");

const interactBtn = document.getElementById("interact-btn");
const crouchBtn = document.getElementById("crouch-btn");
const shootBtn = document.getElementById("shoot-btn");
const ammoCounterEl = document.getElementById("ammo-counter");
const objectiveEl = document.getElementById("objective");
const inventoryBarEl = document.getElementById("inventory-bar");
const tensionVignetteEl = document.getElementById("tension-vignette");
const pauseBtn = document.getElementById("pause-btn");
const pauseOverlay = document.getElementById("pause-overlay");
const resumeBtn = document.getElementById("resume-btn");
const quitBtn = document.getElementById("quit-btn");
const crosshair = document.getElementById("crosshair");
const message = document.getElementById("message");
const catchFlashEl = document.getElementById("catch-flash");

const musicVolume = document.getElementById("music-volume");
const sfxVolume = document.getElementById("sfx-volume");
const sensitivitySlider = document.getElementById("sensitivity");


/* =========================================================
   GAME STATE
========================================================= */

let gameStarted = false;

let hasWeapon = false;

let gameOver = false;

let doorLocked = true;


function setObjective(text) {

  if (!objectiveEl) {

    return;

  }

  objectiveEl.innerText = text;

  objectiveEl.style.display =
    text ? "block" : "none";

}

function updateInventoryUI() {

  if (!inventoryBarEl) {

    return;

  }

  const items = [];

  if (typeof weaponCollected !== "undefined" && weaponCollected) {

    items.push("Bat");

  }

  if (typeof keyCollected !== "undefined" && keyCollected) {

    items.push("Key");

  }

  if (typeof cabinetUnlocked !== "undefined" && cabinetUnlocked) {

    items.push("Flashlight");

  }

  if (typeof gunCollected !== "undefined" && gunCollected) {

    items.push("Pistol");

  }

  if (items.length === 0) {

    inventoryBarEl.style.display = "none";

    return;

  }

  inventoryBarEl.innerText =
    items.join("   •   ");

  inventoryBarEl.style.display = "block";

}
let selectedDifficulty = "normal";

let lookSensitivity =
  Number(sensitivitySlider?.value || 0.005);


/* =========================================================
   AUDIO
========================================================= */

const menuMusic =
  new Audio("assets/audio/menu.mp3");

const ambienceMusic =
  new Audio("assets/audio/ambience.mp3");

const footstepsAudio =
  new Audio("assets/audio/footsteps.mp3");

const doorAudio =
  new Audio("assets/audio/door.mp3");

const caretakerFootstepsAudio =
  new Audio("assets/audio/enemy-footsteps.mp3");

const jumpscareAudio =
  new Audio("assets/audio/jumpscare.mp3");

const spottedAudio =
  new Audio("assets/audio/spotted.mp3");

const gunshotAudio =
  new Audio("assets/audio/gunshot.mp3");

const chaseMusic =
  new Audio("assets/audio/chase-music.mp3");


menuMusic.loop = true;
ambienceMusic.loop = true;
footstepsAudio.loop = true;
caretakerFootstepsAudio.loop = true;
chaseMusic.loop = true;

menuMusic.preload = "auto";
ambienceMusic.preload = "auto";
footstepsAudio.preload = "auto";
doorAudio.preload = "auto";
caretakerFootstepsAudio.preload = "auto";
jumpscareAudio.preload = "auto";
spottedAudio.preload = "auto";
gunshotAudio.preload = "auto";
chaseMusic.preload = "auto";


menuMusic.volume =
  Number(musicVolume?.value || 0.5);

ambienceMusic.volume =
  Number(musicVolume?.value || 0.5);

footstepsAudio.volume =
  Number(sfxVolume?.value || 0.7);

doorAudio.volume =
  Number(sfxVolume?.value || 0.7);

jumpscareAudio.volume =
  Number(sfxVolume?.value || 0.7);

spottedAudio.volume =
  Number(sfxVolume?.value || 0.7);

chaseMusic.volume =
  Number(musicVolume?.value || 0.5);

gunshotAudio.volume =
  Number(sfxVolume?.value || 0.7);


function playAudio(audio) {

  if (!audio) return;

  const promise = audio.play();

  if (promise) {
    promise.catch(() => {});
  }

}


/* =========================================================
   SPLASH SCREEN
========================================================= */

tapToPlay?.addEventListener(
  "click",
  async () => {

    menuMusic.currentTime = 0;

    playAudio(menuMusic);


    /* FULLSCREEN */

    try {

      if (
        document.documentElement.requestFullscreen &&
        !document.fullscreenElement
      ) {

        await document.documentElement.requestFullscreen();

      }

    } catch (error) {

      console.log("Fullscreen tidak tersedia");

    }


    /* LANDSCAPE */

    try {

      if (
        screen.orientation &&
        screen.orientation.lock
      ) {

        await screen.orientation.lock("landscape");

      }

    } catch (error) {

      console.log("Orientation lock tidak tersedia");

    }


    if (splashScreen) {

      splashScreen.classList.add("hide-splash");

    }


    setTimeout(
      () => {

        if (splashScreen) {
          splashScreen.style.display = "none";
        }

        if (startScreen) {
          startScreen.style.display = "block";
        }

        resizeGame();

      },

      800
    );

  }
);


/* =========================================================
   MENU
========================================================= */

function hidePanels() {

  if (difficultyScreen)
    difficultyScreen.style.display = "none";

  if (optionsScreen)
    optionsScreen.style.display = "none";

  if (howScreen)
    howScreen.style.display = "none";

  if (creditsScreen)
    creditsScreen.style.display = "none";

}


function openMenu() {

  hidePanels();

  if (startScreen) {
    startScreen.style.display = "block";
  }

}


startBtn?.addEventListener(
  "click",
  () => {

    startScreen.style.display = "none";

    difficultyScreen.style.display = "flex";

  }
);


optionsBtn?.addEventListener(
  "click",
  () => {

    startScreen.style.display = "none";

    optionsScreen.style.display = "flex";

  }
);


howBtn?.addEventListener(
  "click",
  () => {

    startScreen.style.display = "none";

    howScreen.style.display = "flex";

  }
);


creditsBtn?.addEventListener(
  "click",
  () => {

    startScreen.style.display = "none";

    creditsScreen.style.display = "flex";

  }
);


document
  .querySelectorAll(".back-btn")
  .forEach(
    button => {

      button.addEventListener(
        "click",
        openMenu
      );

    }
  );


/* =========================================================
   OPTIONS
========================================================= */

musicVolume?.addEventListener(
  "input",
  () => {

    const volume =
      Number(musicVolume.value);

    menuMusic.volume = volume;
    ambienceMusic.volume = volume;
    chaseMusic.volume = volume;

  }
);


sfxVolume?.addEventListener(
  "input",
  () => {

    const volume =
      Number(sfxVolume.value);

    footstepsAudio.volume = volume;
    doorAudio.volume = volume;
    jumpscareAudio.volume = volume;
    spottedAudio.volume = volume;
    gunshotAudio.volume = volume;

    /*
       caretakerFootstepsAudio nggak perlu
       di-set di sini karena volumenya udah
       dihitung ulang tiap frame (berdasarkan
       jarak) di updateCaretaker(), dan itu
       udah baca nilai slider terbaru langsung.
    */

  }
);


sensitivitySlider?.addEventListener(
  "input",
  () => {

    lookSensitivity =
      Number(sensitivitySlider.value);

  }
);


/* =========================================================
   THREE.JS SCENE
========================================================= */

const scene =
  new THREE.Scene();


/*
   =====================================================
   NIGHT ATMOSPHERE

   Langit malam gelap kebiruan, fog lebih pekat
   supaya jarak pandang di luar rumah berkesan
   suasana malam yang mencekam.
   =====================================================
*/

const nightSkyColor = 0x05070d;
const nightFogColor = 0x070910;

scene.background =
  new THREE.Color(nightSkyColor);


scene.fog =
  new THREE.FogExp2(
    nightFogColor,
    0.018
  );


/*
   Bintang-bintang sederhana (particle points)
   supaya langit malam tidak terasa kosong.
*/

function createStarfield() {

  const starCount = 600;

  const positions =
    new Float32Array(starCount * 3);

  for (let i = 0; i < starCount; i++) {

    const radius =
      80 + Math.random() * 40;

    const theta =
      Math.random() * Math.PI * 2;

    const phi =
      Math.random() * Math.PI * 0.5;

    positions[i * 3] =
      radius * Math.sin(phi) * Math.cos(theta);

    positions[i * 3 + 1] =
      Math.abs(radius * Math.cos(phi)) + 5;

    positions[i * 3 + 2] =
      radius * Math.sin(phi) * Math.sin(theta);

  }

  const geometry =
    new THREE.BufferGeometry();

  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );

  const material =
    new THREE.PointsMaterial({
      color: 0xbfd4ff,
      size: 0.35,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.8
    });

  const stars =
    new THREE.Points(geometry, material);

  scene.add(stars);

}

createStarfield();


/*
   "Bulan" sebagai directional light redup
   kebiruan, memberi sedikit highlight
   di luar rumah.
*/

const moonLight =
  new THREE.DirectionalLight(
    0x8fa8d9,
    0.5
  );

moonLight.position.set(
  -20,
  30,
  -10
);

scene.add(moonLight);


/* =========================================================
   VIEWPORT
========================================================= */

function getViewportSize() {

  let width =
    window.innerWidth;

  let height =
    window.innerHeight;


  if (width <= height) {

    return {

      width: height,
      height: width

    };

  }


  return {

    width,
    height

  };

}


/* =========================================================
   CAMERA
========================================================= */

const initialSize =
  getViewportSize();


const camera =
  new THREE.PerspectiveCamera(

    70,

    initialSize.width /
    initialSize.height,

    0.08,

    150

  );


camera.rotation.order = "YXZ";


/*
   Posisi awal sementara.

   Setelah house selesai dimuat,
   spawn akan dihitung berdasarkan rumah.
*/

camera.position.set(
  0,
  1.65,
  5
);


/* =========================================================
   RENDERER
========================================================= */

const renderer =
  new THREE.WebGLRenderer({

    antialias: true,

    powerPreference:
      "high-performance"

  });


renderer.setSize(
  initialSize.width,
  initialSize.height
);


renderer.setPixelRatio(

  Math.min(
    window.devicePixelRatio,
    1.25
  )

);


/*
   Shadow OFF agar house 47 MB
   tidak terlalu berat di HP.
*/

renderer.shadowMap.enabled = false;


/*
   TONE MAPPING

   Tanpa ini, cahaya dengan intensitas tinggi
   (dibutuhkan untuk physically-based lighting
   di Three.js modern) akan "meledak" jadi putih/
   pecah alih-alih dikompres halus seperti kamera
   asli. Ini kemungkinan besar penyebab visual
   rumah jadi glitch/gosong kemarin.
*/

renderer.toneMapping =
  THREE.ACESFilmicToneMapping;

renderer.toneMappingExposure = 1.0;

renderer.outputColorSpace =
  THREE.SRGBColorSpace;


container.appendChild(
  renderer.domElement
);


/* =========================================================
   LIGHTING
========================================================= */

const ambient =
  new THREE.AmbientLight(
    0x40485f,
    0.7
  );


scene.add(ambient);


const hemisphere =
  new THREE.HemisphereLight(

    0x2a3550,

    0x0a0805,

    0.6

  );


scene.add(hemisphere);


const lamp =
  new THREE.PointLight(

    0xffc47a,

    45,

    20,

    1.4

  );


lamp.position.set(
  0,
  2.4,
  2
);


scene.add(lamp);


/* =========================================================
   GLTF LOADER
========================================================= */

const loader =
  new GLTFLoader();


/* =========================================================
   HOUSE (PROCEDURAL)

   Rumah dibikin langsung dari kode (bukan file .glb),
   supaya TIDAK perlu download apapun -> tidak ada lagi
   masalah loading lama/gagal di koneksi lambat.

   Tekstur dinding/lantai di-generate lewat canvas
   (procedural noise) biar ada variasi warna/tekstur,
   bukan warna polos flat.
========================================================= */

let houseLoaded = false;

const houseGroup =
  new THREE.Group();

const houseBox =
  new THREE.Box3();


const houseSize =
  new THREE.Vector3();


/*
   Dipisah jadi 2 array:

   - wallColliders: dipakai buat cek tabrakan
     JALAN LURUS (horizontal). Cuma tembok &
     pintu yang tertutup ada di sini.

   - floorColliders: dipakai buat cek TINGGI
     PIJAKAN (raycast ke bawah), termasuk lantai
     DAN anak tangga.

   Sebelumnya cuma ada 1 array gabungan, itu
   yang bikin anak tangga ikut dianggap "tembok"
   pas jalan horizontal -> ketutup tembok pas naik.
*/

const wallColliders = [];

const floorColliders = [];

/*
   collisionMeshes: alias gabungan (dipertahankan
   untuk kompatibilitas kode lain yang masih
   mereferensikan nama ini).
*/

const collisionMeshes = floorColliders;

let doorMesh = null;

let doorPivot = null;


const spawnPosition =
  new THREE.Vector3(
    0,
    1.65,
    9
  );


/*
   =====================================================
   GENERATOR TEKSTUR PROCEDURAL

   Bikin texture lewat canvas dengan noise/variasi warna
   supaya kelihatan lebih "hidup" dibanding warna flat.
   =====================================================
*/

function makeProceduralTexture(
  baseColor,
  variation,
  repeatX,
  repeatY
) {

  const size = 256;

  const canvas =
    document.createElement("canvas");

  canvas.width = size;
  canvas.height = size;

  const ctx =
    canvas.getContext("2d");

  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, size, size);

  const [r, g, b] =
    baseColor.match(/\w\w/g).map(
      hex => parseInt(hex, 16)
    );

  const imageData =
    ctx.getImageData(0, 0, size, size);

  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {

    const noise =
      (Math.random() - 0.5) * variation;

    data[i] =
      Math.min(255, Math.max(0, r + noise));

    data[i + 1] =
      Math.min(255, Math.max(0, g + noise));

    data[i + 2] =
      Math.min(255, Math.max(0, b + noise));

  }

  ctx.putImageData(imageData, 0, 0);

  const texture =
    new THREE.CanvasTexture(canvas);

  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;

  texture.repeat.set(repeatX, repeatY);

  texture.colorSpace = THREE.SRGBColorSpace;

  return texture;

}


const wallTexture =
  makeProceduralTexture("#8f8579", 22, 4, 2);

const floorTexture =
  makeProceduralTexture("#5a4331", 18, 5, 8);

const ceilingTexture =
  makeProceduralTexture("#3f3a35", 14, 4, 2);

const stairTexture =
  makeProceduralTexture("#6b5844", 20, 2, 1);


const wallMaterial =
  new THREE.MeshStandardMaterial({
    map: wallTexture,
    roughness: 0.92,
    side: THREE.DoubleSide
  });

const floorMaterial =
  new THREE.MeshStandardMaterial({
    map: floorTexture,
    roughness: 0.8
  });

const ceilingMaterial =
  new THREE.MeshStandardMaterial({
    map: ceilingTexture,
    roughness: 0.95
  });

const stairMaterial =
  new THREE.MeshStandardMaterial({
    map: stairTexture,
    roughness: 0.85
  });

const doorMaterial =
  new THREE.MeshStandardMaterial({
    color: 0x2b1a10,
    roughness: 0.6
  });


/*
   =====================================================
   HELPER BIKIN TEMBOK

   Otomatis push ke collisionMeshes.
   =====================================================
*/

function addWall(x, y, z, w, h, d) {

  const wall =
    new THREE.Mesh(
      new THREE.BoxGeometry(w, h, d),
      wallMaterial
    );

  wall.position.set(x, y, z);

  houseGroup.add(wall);

  wallColliders.push(wall);

  return wall;

}


function addFloor(x, y, z, w, d, material) {

  const floor =
    new THREE.Mesh(
      new THREE.BoxGeometry(w, 0.2, d),
      material || floorMaterial
    );

  floor.position.set(x, y, z);

  houseGroup.add(floor);

  floorColliders.push(floor);

  return floor;

}


function addCeiling(x, y, z, w, d) {

  const ceiling =
    new THREE.Mesh(
      new THREE.BoxGeometry(w, 0.2, d),
      ceilingMaterial
    );

  ceiling.position.set(x, y, z);

  houseGroup.add(ceiling);

  return ceiling;

}


/*
   =====================================================
   LAYOUT RUMAH

   - Entry hall (dengan pintu depan) -> Hallway -> Living Room
   - Tangga di hallway naik ke Loft (lantai 2 kecil)
   =====================================================
*/

const WALL_HEIGHT = 3;

/* LANTAI DASAR */

addFloor(0, 0, 4, 8, 12, floorMaterial);
addFloor(0, 0, -6, 10, 8, floorMaterial);

addCeiling(0, WALL_HEIGHT, 4, 8, 12);

/*
   Ceiling living room SENGAJA tidak dipasang di sini
   -> nanti digantikan lantai 2 (addFloor) yang dibangun
   di atasnya, jadi berfungsi ganda sebagai plafon
   lantai 1 sekaligus lantai buat lantai 2.
*/


/* DINDING LUAR ENTRY HALL + HALLWAY (sisi kiri & kanan) */

addWall(-4, WALL_HEIGHT / 2, 4, 0.25, WALL_HEIGHT, 12);

/* Sisi kanan dipecah 2, nyisain lubang -> Dapur */
addWall(4, WALL_HEIGHT / 2, 7.5, 0.25, WALL_HEIGHT, 5);
addWall(4, WALL_HEIGHT / 2, 0.5, 0.25, WALL_HEIGHT, 5);

/* DINDING BELAKANG (tempat pintu depan, ada lubang) */

addWall(-2.4, WALL_HEIGHT / 2, 10, 3.2, WALL_HEIGHT, 0.25);
addWall(2.4, WALL_HEIGHT / 2, 10, 3.2, WALL_HEIGHT, 0.25);
addWall(0, 2.7, 10, 1.6, 0.6, 0.25);


/* DINDING PEMISAH HALLWAY -> LIVING ROOM (ada lubang jalan) */

addWall(-3, WALL_HEIGHT / 2, -2, 2, WALL_HEIGHT, 0.25);

/*
   Segmen kanan (dulu di x=3, lebar 2 -> nutup x=2..4)
   SENGAJA dihapus: itu numpuk PERSIS di jalur masuk
   tangga (x=2.1..4.3), jadi walau tangganya sendiri
   udah dibenerin berkali-kali, tembok INI yang beneran
   selalu ngeblok dari awal. Sisi kanan sekarang emang
   dibiarkan terbuka (area tangga).
*/

addWall(0, WALL_HEIGHT - 0.5, -2, 2, 1, 0.25);


/* DINDING LUAR LIVING ROOM */

/* Sisi barat dipecah 2, nyisain lubang -> Kamar Tidur */
addWall(-5, WALL_HEIGHT / 2, -8.5, 0.25, WALL_HEIGHT, 3);
addWall(-5, WALL_HEIGHT / 2, -3.5, 0.25, WALL_HEIGHT, 3);

addWall(5, WALL_HEIGHT / 2, -6, 0.25, WALL_HEIGHT, 8);
addWall(0, WALL_HEIGHT / 2, -10, 10, WALL_HEIGHT, 0.25);


/*
   =====================================================
   PINTU DEPAN

   Dibuat dengan pivot di sisi engsel supaya animasi
   buka pintu berputar dari tepi (bukan dari tengah).
   =====================================================
*/

doorPivot =
  new THREE.Group();

doorPivot.position.set(
  -0.7,
  1.2,
  9.9
);

houseGroup.add(doorPivot);

doorMesh =
  new THREE.Mesh(
    new THREE.BoxGeometry(1.4, 2.4, 0.12),
    doorMaterial
  );

doorMesh.position.set(0.7, 0, 0);

doorPivot.add(doorMesh);

wallColliders.push(doorMesh);


/*
   GAGANG PINTU

   Ditaruh di sisi jauh dari engsel (dekat tepi
   bebas pintu), tinggi kira-kira setinggi tangan.
*/

const handleMaterial =
  new THREE.MeshStandardMaterial({
    color: 0xc9a227,
    metalness: 0.7,
    roughness: 0.3
  });

function createDoorHandle(zOffset) {

  const handleGroup =
    new THREE.Group();

  const plate =
    new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.05, 0.03, 12),
      handleMaterial
    );

  plate.rotation.x = Math.PI / 2;

  handleGroup.add(plate);

  const knob =
    new THREE.Mesh(
      new THREE.SphereGeometry(0.045, 10, 10),
      handleMaterial
    );

  knob.position.z = zOffset;

  handleGroup.add(knob);

  return handleGroup;

}

const doorHandleFront =
  createDoorHandle(0.09);

doorHandleFront.position.set(0.55, -0.2, 0.06);

doorMesh.add(doorHandleFront);

const doorHandleBack =
  createDoorHandle(-0.09);

doorHandleBack.position.set(0.55, -0.2, -0.06);

doorMesh.add(doorHandleBack);


/*
   =====================================================
   TANGGA -> LANTAI 2

   Tangga naik dari hallway sampai MELEWATI plafon
   lantai 1 (WALL_HEIGHT = 3), jadi lantai 2 beneran
   berdiri di atasnya, bukan cuma mezzanine kecil
   di bawah plafon kayak sebelumnya.
   =====================================================
*/

const STAIR_COUNT = 14;

const STAIR_RISE = 0.24;

const STAIR_DEPTH = 0.5;

const STAIR_START_Z = -1.6;

for (let i = 0; i < STAIR_COUNT; i++) {

  const stepY =
    (i + 1) * STAIR_RISE;

  const stepZ =
    STAIR_START_Z -
    i * STAIR_DEPTH;

  const step =
    new THREE.Mesh(
      new THREE.BoxGeometry(2.2, STAIR_RISE, STAIR_DEPTH + 0.05),
      stairMaterial
    );

  step.position.set(3.2, stepY, stepZ);

  houseGroup.add(step);

  collisionMeshes.push(step);

}

/*
   floor2Y: ketinggian lantai 2 (di atas plafon
   lantai 1 yang tingginya WALL_HEIGHT = 3).
*/

const floor2Y =
  STAIR_COUNT * STAIR_RISE;

const stairTopZ =
  STAIR_START_Z -
  STAIR_COUNT * STAIR_DEPTH;


/*
   =====================================================
   LANTAI 2 — LANDING (ujung tangga)
   =====================================================
*/

addFloor(3.2, floor2Y, stairTopZ - 2, 3, 5, floorMaterial);

addCeiling(
  3.2,
  floor2Y + WALL_HEIGHT,
  stairTopZ - 2,
  3,
  5
);


/* Dinding landing dipecah, nyisain lubang -> Ruang Kerja Lt.2 */
addWall(1.8, floor2Y + WALL_HEIGHT / 2, stairTopZ - 4.4, 0.25, WALL_HEIGHT, 3.2);
addWall(1.8, floor2Y + WALL_HEIGHT / 2, stairTopZ + 0.4, 0.25, WALL_HEIGHT, 3.2);


/* DINDING LUAR LANDING
   (sisi tangga masuk sengaja TIDAK dikasih tembok) */

addWall(4.65, floor2Y + WALL_HEIGHT / 2, stairTopZ - 2, 0.25, WALL_HEIGHT, 5);
addWall(3.2, floor2Y + WALL_HEIGHT / 2, stairTopZ - 4.4, 3, WALL_HEIGHT, 0.25);


/*
   =====================================================
   LANTAI 2 — RUANG KERJA (ruangan baru)

   Terhubung dari sisi barat landing tangga.
   =====================================================
*/

addFloor(-1.5, floor2Y, stairTopZ - 2, 6.9, 8, floorMaterial);

addCeiling(-1.5, floor2Y + WALL_HEIGHT, stairTopZ - 2, 6.9, 8);

addWall(-5, floor2Y + WALL_HEIGHT / 2, stairTopZ - 2, 0.25, WALL_HEIGHT, 8);
addWall(-1.5, floor2Y + WALL_HEIGHT / 2, stairTopZ - 6, 7, WALL_HEIGHT, 0.25);
addWall(-1.5, floor2Y + WALL_HEIGHT / 2, stairTopZ + 2, 7, WALL_HEIGHT, 0.25);


const deskMaterial =
  new THREE.MeshStandardMaterial({
    color: 0x4a3a28,
    roughness: 0.75
  });

const studyDesk =
  new THREE.Mesh(
    new THREE.BoxGeometry(2, 0.8, 0.7),
    deskMaterial
  );

studyDesk.position.set(-3.8, floor2Y + 0.4, stairTopZ - 4.5);

houseGroup.add(studyDesk);

wallColliders.push(studyDesk);


const studyLamp =
  new THREE.PointLight(0xffdca8, 12, 4);

studyLamp.position.set(-3.8, floor2Y + 1.2, stairTopZ - 4.5);

houseGroup.add(studyLamp);


/*
   AMMO PACK

   Sumber amunisi tambahan supaya nggak cuma
   3 peluru sepanjang game. Ditaruh di meja
   Ruang Kerja lantai 2.
*/

let ammoPackCollected = false;

const AMMO_PACK_REFILL = 3;

const ammoPackPosition =
  new THREE.Vector3(-3.3, floor2Y + 0.95, stairTopZ - 4.3);

const ammoPack =
  new THREE.Mesh(
    new THREE.BoxGeometry(0.22, 0.12, 0.32),
    new THREE.MeshStandardMaterial({
      color: 0x6b5a2a,
      roughness: 0.6,
      emissive: 0x332b10,
      emissiveIntensity: 0.3
    })
  );

ammoPack.position.copy(ammoPackPosition);

scene.add(ammoPack);


/*
   =====================================================
   DAPUR

   Terhubung dari sisi timur Entry Hall.
   =====================================================
*/

addFloor(7, 0, 4, 6, 6, floorMaterial);
addCeiling(7, WALL_HEIGHT, 4, 6, 6);

addWall(10, WALL_HEIGHT / 2, 4, 0.25, WALL_HEIGHT, 6);
addWall(7, WALL_HEIGHT / 2, 1, 6, WALL_HEIGHT, 0.25);
addWall(7, WALL_HEIGHT / 2, 7, 6, WALL_HEIGHT, 0.25);


const counterMaterial =
  new THREE.MeshStandardMaterial({
    color: 0x555049,
    roughness: 0.6
  });

const kitchenCounter =
  new THREE.Mesh(
    new THREE.BoxGeometry(4, 0.9, 0.7),
    counterMaterial
  );

kitchenCounter.position.set(7, 0.45, 6.4);

houseGroup.add(kitchenCounter);

wallColliders.push(kitchenCounter);


/*
   RAK BUKU (pintu rahasia)

   Interact di sini membuka lubang tembok
   menuju Ruangan Rahasia.
*/

let secretRoomOpen = false;

const bookshelfPosition =
  new THREE.Vector3(9.5, 1.3, 4);

const bookshelf =
  new THREE.Mesh(
    new THREE.BoxGeometry(0.3, 2.6, 1.6),
    new THREE.MeshStandardMaterial({
      color: 0x3a2a1a,
      roughness: 0.85
    })
  );

bookshelf.position.copy(bookshelfPosition);

houseGroup.add(bookshelf);

wallColliders.push(bookshelf);


/*
   =====================================================
   RUANGAN RAHASIA

   Di balik rak buku dapur.
   =====================================================
*/

addFloor(9.5, 0, 1.5, 3, 3, floorMaterial);
addCeiling(9.5, WALL_HEIGHT, 1.5, 3, 3);

addWall(11, WALL_HEIGHT / 2, 1.5, 0.25, WALL_HEIGHT, 3);
addWall(9.5, WALL_HEIGHT / 2, 0, 3, WALL_HEIGHT, 0.25);
addWall(9.5, WALL_HEIGHT / 2, 3, 1.6, WALL_HEIGHT, 0.25);


const secretNoteLight =
  new THREE.PointLight(0xfff0c0, 15, 5);

secretNoteLight.position.set(9.5, 1.8, 1.5);

houseGroup.add(secretNoteLight);


/*
   NOTE (LORE ITEM)

   Kertas yang bisa dibaca lewat INTERACT,
   nambah suasana cerita di ruangan rahasia.
*/

let noteRead = false;

const notePosition =
  new THREE.Vector3(9.8, 0.85, 1.5);

const noteText =
  "The Caretaker was not always like this. " +
  "He used to watch over this house with " +
  "kindness, before whatever happened in the " +
  "basement changed him. Find the way out " +
  "before he finds you.";

const note =
  new THREE.Mesh(
    new THREE.BoxGeometry(0.3, 0.02, 0.4),
    new THREE.MeshStandardMaterial({
      color: 0xe8dfc5,
      roughness: 0.9
    })
  );

note.rotation.x = -Math.PI / 2.3;

note.position.copy(notePosition);

houseGroup.add(note);


/*
   PISTOL (senjata jarak jauh)

   Ditaruh di Ruangan Rahasia, hadiah setelah
   nemuin rak buku.
*/

let gunCollected = false;

let gunAmmo = 0;

const MAX_GUN_AMMO = 3;

const gunPickupPosition =
  new THREE.Vector3(9.5, 0.9, 1.8);

const gunPickup =
  new THREE.Group();

const gunBodyMaterial =
  new THREE.MeshStandardMaterial({
    color: 0x1c1c1e,
    metalness: 0.75,
    roughness: 0.28
  });

const gunAccentMaterial =
  new THREE.MeshStandardMaterial({
    color: 0x3a3a3d,
    metalness: 0.6,
    roughness: 0.4
  });

/*
   SLIDE (bagian atas laras, dibikin dari
   cylinder dipotong biar keliatan lonjong,
   bukan kotak polos).
*/

const gunSlide =
  new THREE.Mesh(
    new THREE.CylinderGeometry(0.045, 0.045, 0.34, 10),
    gunBodyMaterial
  );

gunSlide.rotation.z = Math.PI / 2;

gunSlide.scale.set(1, 1, 0.7);

gunPickup.add(gunSlide);


/* LARAS (moncong, lebih tipis & menonjol ke depan) */

const gunBarrel =
  new THREE.Mesh(
    new THREE.CylinderGeometry(0.02, 0.02, 0.1, 8),
    gunAccentMaterial
  );

gunBarrel.rotation.z = Math.PI / 2;

gunBarrel.position.set(0.2, 0, 0);

gunPickup.add(gunBarrel);


/* FRAME BAWAH (dudukan slide, sedikit lebih rendah) */

const gunFrame =
  new THREE.Mesh(
    new THREE.BoxGeometry(0.22, 0.05, 0.06),
    gunAccentMaterial
  );

gunFrame.position.set(-0.03, -0.045, 0);

gunPickup.add(gunFrame);


/* GAGANG (miring natural, ujung membulat dikit) */

const gunGrip =
  new THREE.Mesh(
    new THREE.CylinderGeometry(0.028, 0.035, 0.22, 8),
    gunBodyMaterial
  );

gunGrip.rotation.z = 0.35;

gunGrip.position.set(-0.13, -0.15, 0);

gunPickup.add(gunGrip);


/* TRIGGER GUARD (lingkaran kecil pelindung pelatuk) */

const gunTriggerGuard =
  new THREE.Mesh(
    new THREE.TorusGeometry(0.035, 0.008, 6, 12, Math.PI * 1.3),
    gunAccentMaterial
  );

gunTriggerGuard.position.set(-0.03, -0.08, 0);

gunTriggerGuard.rotation.x = Math.PI / 2;

gunPickup.add(gunTriggerGuard);


/* FRONT SIGHT (pengintai kecil di ujung laras) */

const gunSight =
  new THREE.Mesh(
    new THREE.BoxGeometry(0.012, 0.02, 0.012),
    gunAccentMaterial
  );

gunSight.position.set(0.16, 0.05, 0);

gunPickup.add(gunSight);


const gunGlow =
  new THREE.PointLight(0xffaa66, 6, 2.5);

gunPickup.add(gunGlow);

gunPickup.position.copy(gunPickupPosition);

scene.add(gunPickup);


function animateGunPickup(time) {

  if (gunCollected || !gunPickup) {

    return;

  }

  gunPickup.position.y =
    gunPickupPosition.y +
    Math.sin(time * 0.0025) * 0.08;

  gunPickup.rotation.y =
    time * 0.0018;

}


/*
   =====================================================
   KAMAR MANDI

   Terhubung dari sisi barat Kamar Tidur.
   =====================================================
*/

addFloor(-10.5, 0, -6, 3, 3, floorMaterial);
addCeiling(-10.5, WALL_HEIGHT, -6, 3, 3);

addWall(-12, WALL_HEIGHT / 2, -6, 0.25, WALL_HEIGHT, 3);
addWall(-10.5, WALL_HEIGHT / 2, -7.5, 3, WALL_HEIGHT, 0.25);
addWall(-10.5, WALL_HEIGHT / 2, -4.5, 3, WALL_HEIGHT, 0.25);


const bathtub =
  new THREE.Mesh(
    new THREE.BoxGeometry(1.6, 0.6, 0.8),
    new THREE.MeshStandardMaterial({
      color: 0xdedad2,
      roughness: 0.3
    })
  );

bathtub.position.set(-11.3, 0.3, -6);

houseGroup.add(bathtub);

wallColliders.push(bathtub);


/*
   =====================================================
   HALAMAN LUAR (di depan pintu)

   Supaya ada area buat "keluar rumah" beneran
   (bukan cuma nabrak batas invisible), dan supaya
   ada tempat pijakan buat trigger menang (escape).
   =====================================================
*/

addFloor(0, 0, 14, 10, 10, floorMaterial);


/*
   =====================================================
   KAMAR TIDUR (ruangan baru)

   Terhubung dari sisi barat Living Room.
   =====================================================
*/

addFloor(-7, 0, -6, 4, 4, floorMaterial);
addCeiling(-7, WALL_HEIGHT, -6, 4, 4);

/* Dinding barat kamar tidur dipecah 2 -> lubang ke Kamar Mandi */
addWall(-9, WALL_HEIGHT / 2, -7.35, 0.25, WALL_HEIGHT, 1.3);
addWall(-9, WALL_HEIGHT / 2, -4.65, 0.25, WALL_HEIGHT, 1.3);
addWall(-7, WALL_HEIGHT / 2, -8, 4, WALL_HEIGHT, 0.25);
addWall(-7, WALL_HEIGHT / 2, -4, 4, WALL_HEIGHT, 0.25);


/* TEMPAT TIDUR */

const bedFrameMaterial =
  new THREE.MeshStandardMaterial({
    color: 0x3b2a1c,
    roughness: 0.8
  });

const bedMattressMaterial =
  new THREE.MeshStandardMaterial({
    color: 0xcfc6b8,
    roughness: 0.9
  });

const bedFrame =
  new THREE.Mesh(
    new THREE.BoxGeometry(1.6, 0.4, 2.2),
    bedFrameMaterial
  );

bedFrame.position.set(-8, 0.2, -6.8);

houseGroup.add(bedFrame);

wallColliders.push(bedFrame);

const bedMattress =
  new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 0.25, 2.1),
    bedMattressMaterial
  );

bedMattress.position.set(-8, 0.52, -6.8);

houseGroup.add(bedMattress);

const bedPillow =
  new THREE.Mesh(
    new THREE.BoxGeometry(1.3, 0.15, 0.4),
    new THREE.MeshStandardMaterial({
      color: 0xe8e2d5,
      roughness: 0.95
    })
  );

bedPillow.position.set(-8, 0.72, -7.7);

houseGroup.add(bedPillow);


/*
   =====================================================
   PUZZLE: KUNCI DI BAWAH BANTAL

   Kunci membuka lemari terkunci di Living Room.
   =====================================================
*/

let keyCollected = false;

const keyPickupPosition =
  new THREE.Vector3(-8, 0.9, -7.7);

const keyPickup =
  new THREE.Mesh(
    new THREE.TorusGeometry(0.08, 0.025, 8, 16),
    new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.7,
      roughness: 0.3,
      emissive: 0x4a3a10,
      emissiveIntensity: 0.4
    })
  );

keyPickup.position.copy(keyPickupPosition);

scene.add(keyPickup);


/*
   LEMARI TERKUNCI (di Living Room, dekat pintu masuk)
*/

let cabinetUnlocked = false;

const cabinetPosition =
  new THREE.Vector3(4.3, 0.9, -3);

const cabinet =
  new THREE.Mesh(
    new THREE.BoxGeometry(1, 1.8, 0.6),
    new THREE.MeshStandardMaterial({
      color: 0x2c2118,
      roughness: 0.75
    })
  );

cabinet.position.copy(cabinetPosition);

houseGroup.add(cabinet);

wallColliders.push(cabinet);


const flashlightRewardLight =
  new THREE.SpotLight(
    0xfff2c0,
    0,
    16,
    Math.PI / 7,
    0.4,
    1.5
  );

flashlightRewardLight.position.set(0.1, -0.05, 0.2);

/*
   SpotLight butuh target eksplisit (arahnya
   ke mana). Target ditaruh di depan kamera,
   ikut nempel sebagai child kamera juga biar
   selalu ngarah lurus ke depan.
*/

const flashlightTarget =
  new THREE.Object3D();

flashlightTarget.position.set(0, -0.05, -5);

camera.add(flashlightTarget);

flashlightRewardLight.target = flashlightTarget;

camera.add(flashlightRewardLight);


/*
   MUZZLE FLASH

   Kilatan cahaya sesaat pas nembak, nempel
   di kamera (intensity 0 default, dinyalain
   sesaat pas shoot lalu dimatiin lagi).
*/

const muzzleFlashLight =
  new THREE.PointLight(0xfff0c0, 0, 8);

muzzleFlashLight.position.set(0.15, -0.1, 0.4);

camera.add(muzzleFlashLight);

let muzzleFlashTimer = 0;

function triggerMuzzleFlash() {

  muzzleFlashLight.intensity = 25;

  muzzleFlashTimer = 0.06;

}

function updateMuzzleFlash(delta) {

  if (muzzleFlashTimer > 0) {

    muzzleFlashTimer -= delta;

    if (muzzleFlashTimer <= 0) {

      muzzleFlashLight.intensity = 0;

    }

  }

}

scene.add(camera);


/*
   =====================================================
   FINALISASI
   =====================================================
*/

scene.add(houseGroup);

houseGroup.updateMatrixWorld(true);

houseBox.setFromObject(houseGroup);

houseBox.getSize(houseSize);

houseLoaded = true;


console.log(
  "HOUSE (PROCEDURAL) READY:",
  houseSize
);

console.log(
  "COLLISION MESH COUNT:",
  collisionMeshes.length
);


spawnPosition.set(0, 1.65, 9);

camera.position.copy(spawnPosition);


/* =========================================================
   ITEM SENJATA (PICKUP)

   Placeholder sederhana (kayu/tongkat) yang bisa
   diambil lewat INTERACT. Setelah diambil, bisa
   dipakai buat "menyerang" Caretaker dari jarak
   dekat (bikin dia pingsan sementara).
========================================================= */

const weaponPickupPosition =
  new THREE.Vector3(-3, 1, -7);

const weaponPickup =
  new THREE.Group();

const weaponHandle =
  new THREE.Mesh(
    new THREE.CylinderGeometry(0.04, 0.04, 0.9, 8),
    new THREE.MeshStandardMaterial({
      color: 0x4a3320,
      roughness: 0.7
    })
  );

weaponHandle.rotation.z =
  Math.PI / 5;

weaponPickup.add(weaponHandle);

const weaponGlow =
  new THREE.PointLight(
    0x88ccff,
    8,
    3
  );

weaponPickup.add(weaponGlow);

weaponPickup.position.copy(
  weaponPickupPosition
);

scene.add(weaponPickup);


let weaponCollected = false;


function animateWeaponPickup(time) {

  if (weaponCollected || !weaponPickup) {

    return;

  }

  weaponPickup.position.y =
    weaponPickupPosition.y +
    Math.sin(time * 0.002) * 0.1;

  weaponPickup.rotation.y =
    time * 0.001;

}


function animateKeyPickup(time) {

  if (keyCollected || !keyPickup) {

    return;

  }

  keyPickup.position.y =
    keyPickupPosition.y +
    Math.sin(time * 0.003) * 0.06;

  keyPickup.rotation.x =
    time * 0.002;

  keyPickup.rotation.y =
    time * 0.0015;

}


/* =========================================================
   COLLISION + FLOOR SYSTEM (RAYCAST)

   Menggunakan mesh rumah procedural di atas, jadi
   otomatis mengikuti bentuk dinding/tangga tanpa perlu
   collider manual terpisah.
========================================================= */


const player = {

  speed: 0.055,

  yaw: Math.PI,

  pitch: 0,

  radius: 0.28,

  height: 1.75,

  eyeOffset: 1.65,

  standEyeOffset: 1.65,

  crouchEyeOffset: 0.95,

  crouching: false,

  /*
     Tinggi lantai saat ini di bawah kaki
     player, dipakai untuk floor-snapping
     (efek bisa naik tangga).
  */

  groundY: 0

};


const raycaster =
  new THREE.Raycaster();


const DOWN =
  new THREE.Vector3(0, -1, 0);


const MAX_STEP_HEIGHT = 0.45;


/*
   Cek apakah pergerakan ke arah (dirX, dirZ)
   sejauh `distance` akan menabrak tembok.
   Ray ditembak dari tinggi dada player supaya
   tidak salah kena lantai/tangga.
*/

function isBlocked(fromX, fromZ, dirX, dirZ, distance, atY, radius) {

  if (
    !houseLoaded ||
    wallColliders.length === 0
  ) {

    return false;

  }

  const dirLength =
    Math.hypot(dirX, dirZ);

  if (dirLength < 0.0001) {

    return false;

  }

  const nx = dirX / dirLength;
  const nz = dirZ / dirLength;

  /*
     atY: tinggi ray custom. Kalau nggak dikasih
     (dipanggil dari player seperti biasa), fallback
     ke tinggi dada player relatif groundY-nya.
  */

  const rayY =
    atY !== undefined
      ? atY
      : player.groundY + player.eyeOffset - 0.35;

  const rayRadius =
    radius !== undefined
      ? radius
      : player.radius;

  const origin =
    new THREE.Vector3(
      fromX,
      rayY,
      fromZ
    );

  const direction =
    new THREE.Vector3(nx, 0, nz);

  raycaster.set(
    origin,
    direction
  );

  raycaster.far =
    distance + rayRadius;

  const hits =
    raycaster.intersectObjects(
      wallColliders,
      false
    );

  return hits.length > 0;

}


/*
   Cari ketinggian lantai di posisi (x,z)
   dengan menembak ray ke bawah dari atas
   kepala player. Ini yang bikin player bisa
   otomatis "naik" tangga selama tingginya
   di bawah MAX_STEP_HEIGHT per langkah.
*/

function getFloorHeight(x, z, referenceY) {

  if (
    !houseLoaded ||
    collisionMeshes.length === 0
  ) {

    return referenceY;

  }

  const origin =
    new THREE.Vector3(
      x,
      referenceY + 2,
      z
    );

  raycaster.set(
    origin,
    DOWN
  );

  raycaster.far = 6;

  const hits =
    raycaster.intersectObjects(
      collisionMeshes,
      false
    );

  if (hits.length > 0) {

    return hits[0].point.y;

  }

  return referenceY;

}


/*
   Batas terluar sebagai jaring pengaman
   tambahan (fallback selama house belum
   ke-load atau raycast tidak kena apa-apa).
*/

function withinHouseBounds(x, z) {

  if (!houseLoaded) {

    return true;

  }

  const margin = 0.3;

  return (

    x > houseBox.min.x + margin &&
    x < houseBox.max.x - margin &&
    z > houseBox.min.z + margin &&
    z < houseBox.max.z - margin

  );

}


function movePlayer(dx, dz) {

  const distance =
    Math.hypot(dx, dz);

  if (distance < 0.0001) {

    return;

  }


  /*
     X TERPISAH (wall sliding)
  */

  const nextX =
    camera.position.x + dx;

  if (
    withinHouseBounds(nextX, camera.position.z) &&
    !isBlocked(
      camera.position.x,
      camera.position.z,
      dx,
      0,
      Math.abs(dx)
    )
  ) {

    camera.position.x = nextX;

  }


  /*
     Z TERPISAH (wall sliding)
  */

  const nextZ =
    camera.position.z + dz;

  if (
    withinHouseBounds(camera.position.x, nextZ) &&
    !isBlocked(
      camera.position.x,
      camera.position.z,
      0,
      dz,
      Math.abs(dz)
    )
  ) {

    camera.position.z = nextZ;

  }


  /*
     FLOOR SNAP (efek naik tangga)
  */

  const targetFloorY =
    getFloorHeight(
      camera.position.x,
      camera.position.z,
      camera.position.y - player.eyeOffset
    );

  const currentFloorY =
    player.groundY;

  const heightDiff =
    targetFloorY - currentFloorY;

  if (
    Math.abs(heightDiff) <= MAX_STEP_HEIGHT
  ) {

    player.groundY = targetFloorY;

  }

  /*
     Kalau selisihnya lebih dari MAX_STEP_HEIGHT
     (misal jurang atau tembok tinggi), groundY
     tetap di posisi lama supaya player tidak
     jatuh/naik tiba-tiba.
  */

}


/*
   Dipertahankan untuk kompatibilitas dengan
   kode lain yang mungkin masih memanggilnya,
   sekarang cuma alias ke withinHouseBounds.
*/

function canMoveTo(x, z) {

  return withinHouseBounds(x, z);

}


/* =========================================================
   CARETAKER (MUSUH)
========================================================= */

let caretaker =
  null;


let caretakerMixer =
  null;


let caretakerAnimations =
  null;


let caretakerSpeed =
  0.012;


/*
   State AI sederhana:
   "patrol"  -> jalan bolak-balik antar waypoint
   "chase"   -> mengejar player
   "stunned" -> pingsan sementara (habis diserang)
*/

let caretakerState =
  "patrol";


let caretakerStunnedUntil = 0;

let CARETAKER_STUN_DURATION = 15000;


function triggerEscape() {

  if (gameOver) {

    return;

  }

  gameOver = true;

  gameStarted = false;


  crosshair.style.display = "none";

  joystick.style.display = "none";

  interactBtn.style.display = "none";

  if (crouchBtn) {

    crouchBtn.style.display = "none";

  }

  if (shootBtn) {

    shootBtn.style.display = "none";

  }

  if (ammoCounterEl) {

    ammoCounterEl.style.display = "none";

  }

  if (pauseBtn) {

    pauseBtn.style.display = "none";

  }

  if (inventoryBarEl) {

    inventoryBarEl.style.display = "none";

  }

  pauseOverlay?.classList.remove("active");

  if (tensionVignetteEl) {

    tensionVignetteEl.style.opacity = 0;

  }


  footstepsAudio.pause();

  ambienceMusic.pause();

  caretakerFootstepsAudio.pause();

  chaseMusic.pause();


  showMessage("You escaped the house... YOU WIN");


  setTimeout(
    () => {

      gameOver = false;


      caretakerState = "patrol";

      caretakerWaypointIndex = 0;
      caretakerWaypointDirection = 1;

      caretakerStuckTimer = 0;

      caretakerLastPosition = null;


      if (caretaker) {

        caretaker.position.x = caretakerSpawn.x;

        caretaker.position.z = caretakerSpawn.z;

        caretaker.rotation.z = 0;

      }

      hasWeapon = false;

      weaponCollected = false;

      if (weaponPickup) {

        weaponPickup.visible = true;

      }

      keyCollected = false;

      if (keyPickup) {

        keyPickup.visible = true;

      }

      cabinetUnlocked = false;

      if (cabinet) {

        cabinet.material.color.set(0x2c2118);

        if (wallColliders.indexOf(cabinet) === -1) {

          wallColliders.push(cabinet);

        }

      }

      if (flashlightRewardLight) {

        flashlightRewardLight.intensity = 0;

      }

      if (doorPivot) {

        doorPivot.rotation.y = 0;

      }

      doorOpen = false;

      if (
        doorMesh &&
        wallColliders.indexOf(doorMesh) === -1
      ) {

        wallColliders.push(doorMesh);

      }

      camera.position.copy(spawnPosition);

      player.yaw = Math.PI;

      player.pitch = 0;

      player.groundY =
        spawnPosition.y - player.eyeOffset;


      setObjective("");

      openMenu();

      menuMusic.currentTime = 0;

      playAudio(menuMusic);

    },

    3500
  );

}


function triggerGameOver() {

  if (gameOver) {

    return;

  }

  gameOver = true;

  gameStarted = false;


  /*
     Efek dampak "ketangkap" — layar merah kilat
     + guncangan kamera singkat. Model musuh
     (CesiumMan) nggak punya animasi nyekik/nyerang,
     jadi ini cara kita kasih kesan "kena hit"
     tanpa animasi karakter yang sebenarnya nggak ada.
  */

  if (catchFlashEl) {

    catchFlashEl.classList.add("active");

  }

  const shakeOrigin =
    camera.position.clone();

  let shakeStep = 0;

  const shakeInterval =
    setInterval(
      () => {

        shakeStep++;

        if (shakeStep > 16) {

          camera.position.copy(shakeOrigin);

          clearInterval(shakeInterval);

          return;

        }

        camera.position.set(
          shakeOrigin.x + (Math.random() - 0.5) * 0.3,
          shakeOrigin.y + (Math.random() - 0.5) * 0.3,
          shakeOrigin.z + (Math.random() - 0.5) * 0.3
        );

      },

      35
    );


  /*
     Sembunyikan HUD gameplay.
  */

  crosshair.style.display = "none";

  joystick.style.display = "none";

  interactBtn.style.display = "none";

  if (crouchBtn) {

    crouchBtn.style.display = "none";

  }

  if (shootBtn) {

    shootBtn.style.display = "none";

  }

  if (ammoCounterEl) {

    ammoCounterEl.style.display = "none";

  }

  if (pauseBtn) {

    pauseBtn.style.display = "none";

  }

  if (inventoryBarEl) {

    inventoryBarEl.style.display = "none";

  }

  pauseOverlay?.classList.remove("active");

  if (tensionVignetteEl) {

    tensionVignetteEl.style.opacity = 0;

  }


  /*
     Hentikan audio gameplay.
  */

  footstepsAudio.pause();

  ambienceMusic.pause();

  caretakerFootstepsAudio.pause();

  chaseMusic.pause();


  showMessage("The Caretaker caught you... GAME OVER");


  setTimeout(
    () => {

      gameOver = false;

      if (catchFlashEl) {

        catchFlashEl.classList.remove("active");

      }


      /*
         Reset posisi/keadaan biar bisa main lagi
         dari menu utama.
      */

      caretakerState = "patrol";

      caretakerWaypointIndex = 0;
      caretakerWaypointDirection = 1;

      caretakerStuckTimer = 0;

      caretakerLastPosition = null;


      if (caretaker) {

        caretaker.position.x = caretakerSpawn.x;

        caretaker.position.z = caretakerSpawn.z;

        caretaker.rotation.z = 0;

      }

      hasWeapon = false;

      weaponCollected = false;

      if (weaponPickup) {

        weaponPickup.visible = true;

      }

      keyCollected = false;

      if (keyPickup) {

        keyPickup.visible = true;

      }

      cabinetUnlocked = false;

      if (cabinet) {

        cabinet.material.color.set(0x2c2118);

        if (wallColliders.indexOf(cabinet) === -1) {

          wallColliders.push(cabinet);

        }

      }

      if (flashlightRewardLight) {

        flashlightRewardLight.intensity = 0;

      }

      camera.position.copy(spawnPosition);

      player.yaw = Math.PI;

      player.pitch = 0;

      player.groundY =
        spawnPosition.y - player.eyeOffset;


      setObjective("");

      openMenu();

      menuMusic.currentTime = 0;

      playAudio(menuMusic);

    },

    3000
  );

}


function stunCaretaker() {

  if (!caretaker) {

    return;

  }

  caretakerState = "stunned";

  caretakerStunnedUntil =
    performance.now() +
    CARETAKER_STUN_DURATION;

  const groundYBeforeFall =
    caretaker.position.y;

  /*
     Efek visual: rebah ke samping
     supaya kelihatan jelas lagi pingsan.
  */

  caretaker.rotation.z =
    Math.PI / 2;

  /*
     BUG SEBELUMNYA: pivot rotasi karakter
     kemungkinan besar di pinggang (bukan
     di kaki), jadi abis diputer badannya
     nembus/ngambang dari lantai bukannya
     rebah beneran di atasnya.

     Fix: hitung ulang bounding box SETELAH
     rotasi, terus geser posisi Y biar titik
     terendah model persis nempel lantai.
  */

  caretaker.updateMatrixWorld(true);

  const fallenBox =
    new THREE.Box3().setFromObject(caretaker);

  const heightBelowFloor =
    fallenBox.min.y - groundYBeforeFall;

  caretaker.position.y -=
    heightBelowFloor;

  if (!caretakerFootstepsAudio.paused) {

    caretakerFootstepsAudio.pause();

  }

  if (!chaseMusic.paused) {

    chaseMusic.pause();

    ambienceMusic.volume =
      Number(musicVolume?.value || 0.5);

  }

  /*
     BUG: animasi jalan (skeletal walk cycle)
     tetap muter walau posisi udah berhenti,
     jadi keliatan kayak "jalan di tempat"
     padahal lagi rebah pingsan.

     Fix: paus action animasi yang lagi jalan.
  */

  if (caretakerAnimations?.__current) {

    caretakerAnimations.__current.paused = true;

  }

  showMessage(
    "You knocked out The Caretaker!"
  );

}


const caretakerWaypoints = [

  new THREE.Vector3(-2.5, 0, -7),

  new THREE.Vector3(2.5, 0, -7),

  new THREE.Vector3(0, 0, -1),

  new THREE.Vector3(0, 0, 7),

  new THREE.Vector3(7, 0, 4),

  new THREE.Vector3(-7, 0, -6),

  new THREE.Vector3(3.2, 0, -1.6),

  new THREE.Vector3(3.2, floor2Y, stairTopZ - 2),

  new THREE.Vector3(-2, floor2Y, stairTopZ - 2)

];


let caretakerWaypointIndex = 0;

let caretakerWaypointDirection = 1;

/*
   DETEKSI STUCK (pengaman tambahan)

   Kalau posisi musuh nggak berubah signifikan
   selama beberapa detik padahal lagi "moving"
   (ketutup tembok di jalur lurus, dsb), paksa
   dia pindah waypoint biar nggak macet permanen.
*/

let caretakerLastPosition = null;

let caretakerStuckTimer = 0;

const CARETAKER_STUCK_THRESHOLD = 2.2;


let CARETAKER_CHASE_RADIUS = 6;

let CARETAKER_LOSE_RADIUS = 10;

const CARETAKER_WAYPOINT_THRESHOLD = 0.4;


const caretakerSpawn =
  new THREE.Vector3(
    0,
    0,
    -3
  );


loader.load(

  "assets/models/enemy.glb",


  gltf => {

    caretaker =
      gltf.scene;


    caretaker.updateMatrixWorld(
      true
    );


    const originalBox =
      new THREE.Box3()
        .setFromObject(
          caretaker
        );


    const originalSize =
      new THREE.Vector3();


    originalBox.getSize(
      originalSize
    );


    console.log(
      "CARETAKER ORIGINAL SIZE:",
      originalSize
    );


    if (
      Number.isFinite(originalSize.y) &&
      originalSize.y > 0
    ) {

      const scale =
        1.8 /
        originalSize.y;


      caretaker.scale.setScalar(
        scale
      );

    }


    caretaker.updateMatrixWorld(
      true
    );


    const scaledBox =
      new THREE.Box3()
        .setFromObject(
          caretaker
        );


    caretaker.position.y -=
      scaledBox.min.y;


    caretaker.position.x =
      caretakerSpawn.x;


    caretaker.position.z =
      caretakerSpawn.z;


    caretaker.updateMatrixWorld(
      true
    );


    caretaker.traverse(
      object => {

        if (object.isMesh) {

          object.castShadow =
            false;


          object.receiveShadow =
            false;


          object.frustumCulled =
            true;

        }

      }
    );


    scene.add(
      caretaker
    );


    /*
       =====================================================
       ANIMATION

       Simpan SEMUA clip animasi (bukan cuma index 0)
       supaya kita bisa pilih clip "walk"/"idle" kalau
       namanya ketahuan, atau fallback ke clip pertama.
       =====================================================
    */

    if (
      gltf.animations &&
      gltf.animations.length > 0
    ) {

      caretakerMixer =
        new THREE.AnimationMixer(
          caretaker
        );


      caretakerAnimations = {};


      gltf.animations.forEach(
        clip => {

          const action =
            caretakerMixer.clipAction(clip);

          caretakerAnimations[
            clip.name.toLowerCase()
          ] = action;

        }
      );


      const firstAction =
        caretakerMixer.clipAction(
          gltf.animations[0]
        );


      firstAction.play();

      caretakerAnimations.__current =
        firstAction;

    }


    console.log(
      "CARETAKER LOADED"
    );

  },


  undefined,


  error => {

    console.error(
      "CARETAKER ERROR:",
      error
    );

  }

);


/*
   Ganti clip animasi Caretaker berdasarkan
   kata kunci nama clip (walk/run/idle),
   fallback diam kalau tidak ketemu.
*/

function playCaretakerAnimation(keyword) {

  if (!caretakerAnimations) {

    return;

  }

  const match =
    Object.keys(caretakerAnimations)
      .find(
        name =>
          name !== "__current" &&
          name.includes(keyword)
      );

  if (!match) {

    return;

  }

  const nextAction =
    caretakerAnimations[match];

  const current =
    caretakerAnimations.__current;

  if (current === nextAction) {

    return;

  }

  if (current) {

    current.fadeOut(0.3);

  }

  nextAction
    .reset()
    .fadeIn(0.3)
    .play();

  caretakerAnimations.__current =
    nextAction;

}


/*
   AI sederhana: patrol antar waypoint,
   kejar player kalau dekat, kembali patrol
   kalau player kabur cukup jauh.
*/

function updateCaretaker(delta) {

  if (
    !gameStarted ||
    !caretaker
  ) {

    return;

  }


  /*
     STUNNED: skip semua AI, cuma
     cek apakah waktunya udah abis.
  */

  if (caretakerState === "stunned") {

    if (
      performance.now() >
      caretakerStunnedUntil
    ) {

      caretakerState = "patrol";

      const groundYBeforeStand =
        getFloorHeight(
          caretaker.position.x,
          caretaker.position.z,
          caretaker.position.y
        );

      caretaker.rotation.z = 0;

      caretaker.updateMatrixWorld(true);

      const standingBox =
        new THREE.Box3().setFromObject(caretaker);

      caretaker.position.y -=
        standingBox.min.y - groundYBeforeStand;

      if (caretakerAnimations?.__current) {

        caretakerAnimations.__current.paused = false;

      }

      showMessage(
        "The Caretaker wakes up..."
      );

    }

    return;

  }


  /*
     BUG SEBELUMNYA: jarak ke player dihitung
     cuma pakai X,Z (Vector2) -> Y/ketinggian
     lantai diabaikan sama sekali. Akibatnya
     musuh di lantai 1 & player di lantai 2
     (tapi X,Z kebetulan deket) dianggap
     "berdekatan", bahkan bisa ke-trigger
     nangkep padahal beda lantai/nggak ketemu.

     Sekarang pakai jarak 3D (Vector3.distanceTo),
     otomatis nge-include beda ketinggian.
  */

  const distanceToPlayer =
    camera.position.distanceTo(
      caretaker.position
    );


  /*
     TENTUKAN STATE

     Radius deteksi sekarang dinamis, mensimulasikan
     "suara" dari player:
     - Jongkok -> jauh lebih sunyi (susah kedengeran)
     - Diam (ga gerak sama sekali) -> agak sunyi
     - Jalan normal -> radius normal
  */

  const playerMoving =
    Math.abs(moveX) > 0.05 ||
    Math.abs(moveY) > 0.05 ||
    keys["w"] || keys["a"] ||
    keys["s"] || keys["d"];

  let noiseMultiplier = 1;

  if (player.crouching) {

    noiseMultiplier = 0.4;

  }
  else if (!playerMoving) {

    noiseMultiplier = 0.6;

  }

  const effectiveChaseRadius =
    CARETAKER_CHASE_RADIUS * noiseMultiplier;

  /*
     DETEKSI VISUAL (line-of-sight)

     Selain "dengar suara", Caretaker juga bisa
     LIHAT player kalau: dalam jarak pandang,
     dalam sudut pandang depan (bukan di belakang
     dia), dan nggak ada tembok yang ngalangin.
  */

  const CARETAKER_VIEW_DISTANCE = 11;

  const CARETAKER_VIEW_ANGLE =
    (110 * Math.PI) / 180;

  let playerSpotted = false;

  if (
    caretakerState === "patrol" &&
    distanceToPlayer < CARETAKER_VIEW_DISTANCE
  ) {

    const toPlayerX =
      camera.position.x - caretaker.position.x;

    const toPlayerZ =
      camera.position.z - caretaker.position.z;

    const toPlayerLength =
      Math.hypot(toPlayerX, toPlayerZ);

    if (toPlayerLength > 0.0001) {

      const toPlayerNormX = toPlayerX / toPlayerLength;
      const toPlayerNormZ = toPlayerZ / toPlayerLength;

      /*
         Arah hadap Caretaker (dari rotation.y
         yang sudah dihitung pakai atan2(nx, nz)
         di frame sebelumnya).
      */

      const facingX = Math.sin(caretaker.rotation.y);
      const facingZ = Math.cos(caretaker.rotation.y);

      const dot =
        facingX * toPlayerNormX +
        facingZ * toPlayerNormZ;

      const angleToPlayer = Math.acos(
        THREE.MathUtils.clamp(dot, -1, 1)
      );

      if (angleToPlayer < CARETAKER_VIEW_ANGLE / 2) {

        /*
           Cek nggak ada tembok yang ngalangin
           pandangan (raycast dari mata Caretaker
           ke player).
        */

        raycaster.set(
          new THREE.Vector3(
            caretaker.position.x,
            caretaker.position.y + 1.5,
            caretaker.position.z
          ),
          new THREE.Vector3(
            toPlayerNormX,
            0,
            toPlayerNormZ
          )
        );

        raycaster.far = toPlayerLength;

        const blockHits =
          raycaster.intersectObjects(wallColliders, false);

        if (blockHits.length === 0) {

          playerSpotted = true;

        }

      }

    }

  }

  if (
    caretakerState === "patrol" &&
    (distanceToPlayer < effectiveChaseRadius || playerSpotted)
  ) {

    caretakerState = "chase";

    if (!spottedAudio.paused) {

      spottedAudio.currentTime = 0;

    }

    playAudio(spottedAudio);

    chaseMusic.currentTime = 0;

    playAudio(chaseMusic);

    showMessage(
      playerSpotted
        ? "The Caretaker sees you!"
        : "The Caretaker heard you..."
    );

  }
  else if (
    caretakerState === "chase" &&
    distanceToPlayer > CARETAKER_LOSE_RADIUS
  ) {

    caretakerState = "patrol";

    if (!chaseMusic.paused) {

      chaseMusic.pause();

    }

  }


  /*
     Percepat playback animasi pas chase, biar
     keliatan kesan "lari" (model cuma punya 1
     clip animasi, jadi ini akal-akalan lewat
     timeScale, bukan clip lari beneran).
  */

  if (caretakerAnimations?.__current) {

    caretakerAnimations.__current.timeScale =
      caretakerState === "chase" ? 1.7 : 1;

  }


  let targetX = caretaker.position.x;

  let targetZ = caretaker.position.z;

  let moving = false;


  if (caretakerState === "chase") {

    targetX = camera.position.x;
    targetZ = camera.position.z;

    moving = distanceToPlayer > 0.8;

  }
  else {

    const waypoint =
      caretakerWaypoints[caretakerWaypointIndex];

    targetX = waypoint.x;
    targetZ = waypoint.z;

    const distanceToWaypoint =
      Math.hypot(
        waypoint.x - caretaker.position.x,
        waypoint.z - caretaker.position.z
      );

    if (
      distanceToWaypoint < CARETAKER_WAYPOINT_THRESHOLD
    ) {

      /*
         GANTI dari "loncat acak ke waypoint manapun"
         jadi PING-PONG berurutan (0 -> terakhir -> 0).

         Alasan: AI musuh nggak punya pathfinding beneran
         (cuma jalan lurus ke target). Waypoint diurutin
         supaya index yang bersebelahan itu SELALU bisa
         dicapai lewat jalur lurus yang nggak ketutup
         tembok (termasuk yang ke lantai 2 -> harus lewat
         "kaki tangga" dulu baru "landing atas", bukan
         loncat langsung). Loncat acak sebelumnya bisa
         milih titik lantai 2 dari posisi yang jalur
         lurusnya ketutup tembok -> musuh stuck selamanya,
         nggak pernah beneran naik.
      */

      caretakerWaypointIndex +=
        caretakerWaypointDirection;

      if (
        caretakerWaypointIndex >=
        caretakerWaypoints.length - 1
      ) {

        caretakerWaypointIndex =
          caretakerWaypoints.length - 1;

        caretakerWaypointDirection = -1;

      }
      else if (caretakerWaypointIndex <= 0) {

        caretakerWaypointIndex = 0;
        caretakerWaypointDirection = 1;

        caretakerStuckTimer = 0;

        caretakerLastPosition = null;


        caretakerWaypointDirection = 1;

      }

    }

    moving = true;

  }


  if (moving) {

    const dirX = targetX - caretaker.position.x;
    const dirZ = targetZ - caretaker.position.z;

    const length =
      Math.hypot(dirX, dirZ);

    if (length > 0.0001) {

      const nx = dirX / length;
      const nz = dirZ / length;

      const speed =
        caretakerState === "chase"
          ? caretakerSpeed * 1.6
          : caretakerSpeed;

      const step =
        speed * (delta * 60);

      /*
         Tinggi ray disesuaikan ke "dada"
         Caretaker sendiri (relatif posisi
         Y dia sekarang), bukan pakai punya
         player -> supaya akurat pas dia lagi
         di tangga/loft juga.
      */

      const caretakerRayY =
        caretaker.position.y + 1.0;

      const caretakerRadius = 0.32;


      /*
         X TERPISAH (wall sliding),
         sama kayak movePlayer().
      */

      const moveXAmount = nx * step;
      const moveZAmount = nz * step;

      if (
        !isBlocked(
          caretaker.position.x,
          caretaker.position.z,
          moveXAmount,
          0,
          Math.abs(moveXAmount),
          caretakerRayY,
          caretakerRadius
        )
      ) {

        caretaker.position.x += moveXAmount;

      }

      if (
        !isBlocked(
          caretaker.position.x,
          caretaker.position.z,
          0,
          moveZAmount,
          Math.abs(moveZAmount),
          caretakerRayY,
          caretakerRadius
        )
      ) {

        caretaker.position.z += moveZAmount;

      }


      /*
         Hadapkan Caretaker ke arah
         gerakannya.
      */

      const targetRotation =
        Math.atan2(nx, nz);

      caretaker.rotation.y =
        targetRotation;

    }

  }


  /*
     Snap ke lantai supaya Caretaker
     juga ikut naik tangga.
  */

  const floorY =
    getFloorHeight(
      caretaker.position.x,
      caretaker.position.z,
      caretaker.position.y
    );

  caretaker.position.y = floorY;


  /*
     DETEKSI STUCK

     Cuma relevan pas patrol (chase udah pasti
     ngejar posisi player yang terus berubah,
     nggak perlu dicek).
  */

  if (caretakerState === "patrol") {

    if (!caretakerLastPosition) {

      caretakerLastPosition =
        caretaker.position.clone();

    }

    const movedDistance =
      caretaker.position.distanceTo(
        caretakerLastPosition
      );

    if (movedDistance < 0.15) {

      caretakerStuckTimer += delta;

    }
    else {

      caretakerStuckTimer = 0;

      caretakerLastPosition =
        caretaker.position.clone();

    }

    if (
      caretakerStuckTimer >
      CARETAKER_STUCK_THRESHOLD
    ) {

      /*
         Paksa pindah waypoint (skip beberapa
         langkah ke arah yang sama, kalau masih
         gagal juga arahnya nanti kebalik pas
         sampai di ujung array).
      */

      caretakerWaypointIndex +=
        caretakerWaypointDirection * 2;

      caretakerWaypointIndex =
        THREE.MathUtils.clamp(
          caretakerWaypointIndex,
          0,
          caretakerWaypoints.length - 1
        );

      caretakerStuckTimer = 0;

    }

  }


  /*
     ANIMASI
  */

  if (moving) {

    playCaretakerAnimation("walk");

    if (!Object.keys(caretakerAnimations || {}).some(n => n.includes("walk"))) {

      playCaretakerAnimation("run");

    }

  }
  else {

    playCaretakerAnimation("idle");

  }


  /*
     AUDIO LANGKAH KAKI MUSUH

     Volume makin kenceng makin deket dia
     ke player, biar kerasa mengancam.
  */

  if (moving) {

    const maxHearDistance = 14;

    const proximity =
      1 -
      Math.min(
        distanceToPlayer / maxHearDistance,
        1
      );

    caretakerFootstepsAudio.volume =
      Math.max(0, proximity) *
      Number(sfxVolume?.value || 0.7);

    if (caretakerFootstepsAudio.paused) {

      playAudio(caretakerFootstepsAudio);

    }

  }
  else if (!caretakerFootstepsAudio.paused) {

    caretakerFootstepsAudio.pause();

  }


  /*
     MUSIK KEJAR-KEJARAN

     Nyala pas musuh masuk mode "chase", mati
     lagi pas balik "patrol"/"stunned". Ambience
     biasa diredupin sementara biar musik kejar
     lebih dominan/menegangkan.
  */

  if (caretakerState === "chase") {

    if (chaseMusic.paused) {

      chaseMusic.currentTime = 0;

      playAudio(chaseMusic);

      ambienceMusic.volume =
        Number(musicVolume?.value || 0.5) * 0.25;

    }

  }
  else if (!chaseMusic.paused) {

    chaseMusic.pause();

    ambienceMusic.volume =
      Number(musicVolume?.value || 0.5);

  }


  /*
     VIGNETTE KETEGANGAN

     Makin deket musuh pas mode chase, makin
     merah/kuat pinggiran layar. Nol pas patrol.
  */

  if (tensionVignetteEl) {

    if (caretakerState === "chase") {

      const proximity =
        1 -
        THREE.MathUtils.clamp(
          distanceToPlayer / CARETAKER_LOSE_RADIUS,
          0,
          1
        );

      tensionVignetteEl.style.opacity =
        (proximity * 0.85).toFixed(2);

    }
    else {

      tensionVignetteEl.style.opacity = 0;

    }

  }


  /*
     KALAH KALAU KETANGKAP
  */

  if (
    caretakerState === "chase" &&
    distanceToPlayer < 0.9
  ) {

    jumpscareAudio.currentTime = 0;

    playAudio(jumpscareAudio);

    triggerGameOver();

  }

}


/* =========================================================
   DIFFICULTY
========================================================= */

document
  .querySelectorAll(
    ".difficulty-btn"
  )
  .forEach(
    button => {

      button.addEventListener(
        "click",

        async () => {

          selectedDifficulty =
            button.dataset.difficulty;


          if (
            selectedDifficulty ===
            "easy"
          ) {

            player.speed =
              0.06;


            caretakerSpeed =
              0.007;

            CARETAKER_CHASE_RADIUS = 5;

            CARETAKER_LOSE_RADIUS = 8;

            CARETAKER_STUN_DURATION = 20000;

          }


          else if (
            selectedDifficulty ===
            "hard"
          ) {

            player.speed =
              0.05;


            caretakerSpeed =
              0.017;

            CARETAKER_CHASE_RADIUS = 9;

            CARETAKER_LOSE_RADIUS = 14;

            CARETAKER_STUN_DURATION = 8000;

          }


          else {

            player.speed =
              0.055;


            caretakerSpeed =
              0.012;

            CARETAKER_CHASE_RADIUS = 6;

            CARETAKER_LOSE_RADIUS = 10;

            CARETAKER_STUN_DURATION = 15000;

          }


          await beginGame();

        }
      );

    }
  );


/* =========================================================
   BEGIN GAME
========================================================= */

async function beginGame() {

  gameStarted =
    true;


  hidePanels();


  startScreen.style.display =
    "none";


  /*
     HUD
  */

  crosshair.style.display =
    "block";


  joystick.style.display =
    "block";


  interactBtn.style.display =
    "block";


  if (crouchBtn) {

    crouchBtn.style.display =
      "block";

  }


  /*
     SPAWN
  */

  camera.position.copy(
    spawnPosition
  );

  player.groundY =
    spawnPosition.y - player.eyeOffset;


  player.yaw =
    Math.PI;


  player.pitch =
    0;


  /*
     CARETAKER SPAWN
  */

  caretakerState = "patrol";
  caretakerWaypointIndex = 0;
  caretakerWaypointDirection = 1;

  caretakerStuckTimer = 0;

  caretakerLastPosition = null;


  if (caretaker) {

    caretaker.position.x =
      caretakerSpawn.x;


    caretaker.position.z =
      caretakerSpawn.z;

    caretaker.rotation.z = 0;

  }


  /*
     RESET SENJATA
  */

  hasWeapon = false;

  weaponCollected = false;

  if (weaponPickup) {

    weaponPickup.visible = true;

  }


  /*
     RESET KUNCI & LEMARI
  */

  keyCollected = false;

  if (keyPickup) {

    keyPickup.visible = true;

  }

  cabinetUnlocked = false;

  if (cabinet) {

    cabinet.material.color.set(0x2c2118);

    if (wallColliders.indexOf(cabinet) === -1) {

      wallColliders.push(cabinet);

    }

  }

  if (flashlightRewardLight) {

    flashlightRewardLight.intensity = 0;

  }

  gunCollected = false;

  gunAmmo = 0;

  if (gunPickup) {

    gunPickup.visible = true;

  }

  ammoPackCollected = false;

  if (ammoPack) {

    ammoPack.visible = true;

  }

  if (shootBtn) {

    shootBtn.style.display = "none";

  }

  updateAmmoUI();

  doorLocked = true;

  if (doorMesh && wallColliders.indexOf(doorMesh) === -1) {

    wallColliders.push(doorMesh);

  }

  if (doorPivot) {

    doorPivot.rotation.y = 0;

  }

  doorOpen = false;

  setObjective(
    "Find a way to unlock the front door before The Caretaker finds you."
  );

  updateInventoryUI();

  if (pauseBtn) {

    pauseBtn.style.display = "flex";

  }


  /*
     AUDIO
  */

  menuMusic.pause();

  menuMusic.currentTime =
    0;


  ambienceMusic.currentTime =
    0;


  playAudio(
    ambienceMusic
  );


  /*
     FULLSCREEN
  */

  try {

    if (
      document.documentElement.requestFullscreen &&
      !document.fullscreenElement
    ) {

      await document
        .documentElement
        .requestFullscreen();

    }

  }

  catch (error) {}


  /*
     LANDSCAPE
  */

  try {

    if (
      screen.orientation &&
      screen.orientation.lock
    ) {

      await screen.orientation
        .lock(
          "landscape"
        );

    }

  }

  catch (error) {}


  setTimeout(
    resizeGame,
    150
  );

}


/* =========================================================
   TOUCH ROTATION HELPER
========================================================= */

function isForcedRotate() {

  return (

    window.innerWidth <=
    window.innerHeight

  );

}


function toLocalDelta(
  dx,
  dy
) {

  if (
    isForcedRotate()
  ) {

    return {

      dx: dy,

      dy: -dx

    };

  }


  return {

    dx,
    dy

  };

}


/* =========================================================
   JOYSTICK
========================================================= */

let moveX = 0;

let moveY = 0;


let joystickTouchId =
  null;


let lookTouchId =
  null;


let lastLookX =
  0;


let lastLookY =
  0;


function resetJoystick() {

  moveX = 0;

  moveY = 0;

  joystickTouchId = null;


  if (stick) {

    stick.style.transform =
      "translate(0px, 0px)";

  }

}


/* =========================================================
   UPDATE JOYSTICK
========================================================= */

function updateJoystick(
  touch
) {

  if (!joystick) {

    return;

  }


  const rect =
    joystick
      .getBoundingClientRect();


  const centerX =
    rect.left +
    rect.width / 2;


  const centerY =
    rect.top +
    rect.height / 2;


  let dx =
    touch.clientX -
    centerX;


  let dy =
    touch.clientY -
    centerY;


  const max =
    35;


  const distance =
    Math.hypot(
      dx,
      dy
    );


  if (
    distance > max
  ) {

    dx =
      dx /
      distance *
      max;


    dy =
      dy /
      distance *
      max;

  }


  const local =
    toLocalDelta(
      dx,
      dy
    );


  moveX =
    local.dx /
    max;


  moveY =
    local.dy /
    max;


  stick.style.transform =

    `translate(${local.dx}px, ${local.dy}px)`;

}


/* =========================================================
   TOUCH START
========================================================= */

document.addEventListener(
  "touchstart",

  event => {

    if (!gameStarted) {

      return;

    }


    for (
      const touch
      of event.changedTouches
    ) {

      const element =
        document.elementFromPoint(

          touch.clientX,

          touch.clientY

        );


      if (!element) {

        continue;

      }


      /*
         INTERACT BUTTON / CROUCH BUTTON / SHOOT BUTTON / PAUSE BUTTON
      */

      if (
        element.closest?.(
          "#interact-btn"
        ) ||
        element.closest?.(
          "#crouch-btn"
        ) ||
        element.closest?.(
          "#shoot-btn"
        ) ||
        element.closest?.(
          "#pause-btn"
        )
      ) {

        continue;

      }


      /*
         JOYSTICK
      */

      if (

        joystickTouchId === null &&

        (
          element === joystick ||
          element === stick ||
          joystick?.contains(element)
        )

      ) {

        joystickTouchId =
          touch.identifier;


        updateJoystick(
          touch
        );


        continue;

      }


      /*
         LOOK
      */

      if (
        lookTouchId === null
      ) {

        lookTouchId =
          touch.identifier;


        lastLookX =
          touch.clientX;


        lastLookY =
          touch.clientY;

      }

    }

  },

  {
    passive: true
  }
);


/* =========================================================
   TOUCH MOVE
========================================================= */

document.addEventListener(
  "touchmove",

  event => {

    if (!gameStarted) {

      return;

    }


    event.preventDefault();


    for (
      const touch
      of event.changedTouches
    ) {


      /*
         JOYSTICK
      */

      if (
        touch.identifier ===
        joystickTouchId
      ) {

        updateJoystick(
          touch
        );


        continue;

      }


      /*
         CAMERA
      */

      if (
        touch.identifier ===
        lookTouchId
      ) {

        const dx =
          touch.clientX -
          lastLookX;


        const dy =
          touch.clientY -
          lastLookY;


        const local =
          toLocalDelta(
            dx,
            dy
          );


        player.yaw -=

          local.dx *
          lookSensitivity;


        player.pitch -=

          local.dy *
          lookSensitivity *
          0.8;


        player.pitch =

          THREE.MathUtils.clamp(

            player.pitch,

            -1.05,

            1.05

          );


        lastLookX =
          touch.clientX;


        lastLookY =
          touch.clientY;

      }

    }

  },

  {
    passive: false
  }
);


/* =========================================================
   TOUCH END
========================================================= */

function handleTouchEnd(
  event
) {

  for (
    const touch
    of event.changedTouches
  ) {

    if (
      touch.identifier ===
      joystickTouchId
    ) {

      resetJoystick();

    }


    if (
      touch.identifier ===
      lookTouchId
    ) {

      lookTouchId =
        null;

    }

  }

}


document.addEventListener(
  "touchend",
  handleTouchEnd
);


document.addEventListener(
  "touchcancel",
  handleTouchEnd
);


/* =========================================================
   KEYBOARD
========================================================= */

const keys = {};


window.addEventListener(
  "keydown",

  event => {

    keys[
      event.key.toLowerCase()
    ] = true;

  }
);


window.addEventListener(
  "keyup",

  event => {

    keys[
      event.key.toLowerCase()
    ] = false;

  }
);


/* =========================================================
   MOVEMENT
========================================================= */

const forwardVector =
  new THREE.Vector3();


const rightVector =
  new THREE.Vector3();


const movement =
  new THREE.Vector3();


/* =========================================================
   UPDATE PLAYER
========================================================= */

function updatePlayer(delta) {

  if (!gameStarted) {

    return;

  }


  let forward =
    -moveY;


  let strafe =
    moveX;


  /*
     PC
  */

  if (keys["w"]) {

    forward += 1;

  }


  if (keys["s"]) {

    forward -= 1;

  }


  if (keys["a"]) {

    strafe -= 1;

  }


  if (keys["d"]) {

    strafe += 1;

  }


  /*
     FOOTSTEPS
  */

  const moving =

    Math.abs(forward) > 0.05 ||

    Math.abs(strafe) > 0.05;


  if (moving) {

    if (
      footstepsAudio.paused
    ) {

      playAudio(
        footstepsAudio
      );

    }

  }

  else {

    if (
      !footstepsAudio.paused
    ) {

      footstepsAudio.pause();

    }

  }


  /*
     NORMALIZE DIAGONAL
  */

  const length =
    Math.hypot(
      forward,
      strafe
    );


  if (
    length > 1
  ) {

    forward /=
      length;


    strafe /=
      length;

  }


  /*
     FORWARD
  */

  forwardVector.set(

    -Math.sin(
      player.yaw
    ),

    0,

    -Math.cos(
      player.yaw
    )

  );


  /*
     RIGHT
  */

  rightVector.set(

    Math.cos(
      player.yaw
    ),

    0,

    -Math.sin(
      player.yaw
    )

  );


  movement.set(
    0,
    0,
    0
  );


  const currentSpeed =
    player.crouching
      ? player.speed * 0.5
      : player.speed;


  movement.addScaledVector(

    forwardVector,

    forward *
    currentSpeed

  );


  movement.addScaledVector(

    rightVector,

    strafe *
    currentSpeed

  );


  movePlayer(

    movement.x,

    movement.z

  );


  /*
     TINGGI MATA

     Mengikuti groundY (hasil floor-snap),
     jadi otomatis naik saat di tangga.
     eyeOffset ditransisi halus antara
     posisi berdiri <-> jongkok.
  */

  const targetEyeOffset =
    player.crouching
      ? player.crouchEyeOffset
      : player.standEyeOffset;

  player.eyeOffset +=
    (targetEyeOffset - player.eyeOffset) * 0.18;

  camera.position.y =
    player.groundY +
    player.eyeOffset;


  /*
     CAMERA ROTATION
  */

  camera.rotation.y =
    player.yaw;


  camera.rotation.x =
    player.pitch;


  /*
     ESCAPE: keluar cukup jauh dari
     pintu depan (z > 12, pintu ada
     di z ~9.9) -> menang.
  */

  if (
    camera.position.z > 12 &&
    !gameOver
  ) {

    triggerEscape();

  }


  updateInteractHint();

}


/*
   HINT VISUAL: crosshair berubah warna/gede
   kalau lagi deket sesuatu yang bisa di-INTERACT,
   biar nggak nebak-nebak jarak.
*/

function updateInteractHint() {

  if (!crosshair) {

    return;

  }

  let nearSomething = false;

  const checkDist = (pos, range) => {

    if (!pos) {

      return false;

    }

    return camera.position.distanceTo(pos) < range;

  };

  if (
    hasWeapon &&
    caretaker &&
    caretakerState !== "stunned" &&
    checkDist(caretaker.position, 2.2)
  ) {

    nearSomething = true;

  }

  if (!weaponCollected && checkDist(weaponPickupPosition, 1.8)) {

    nearSomething = true;

  }

  if (!keyCollected && checkDist(keyPickupPosition, 1.6)) {

    nearSomething = true;

  }

  if (!cabinetUnlocked && checkDist(cabinetPosition, 1.8)) {

    nearSomething = true;

  }

  if (!secretRoomOpen && checkDist(bookshelfPosition, 1.8)) {

    nearSomething = true;

  }

  if (!gunCollected && checkDist(gunPickupPosition, 1.6)) {

    nearSomething = true;

  }

  if (!ammoPackCollected && checkDist(ammoPackPosition, 1.6)) {

    nearSomething = true;

  }

  if (checkDist(notePosition, 1.6)) {

    nearSomething = true;

  }

  if (doorMesh) {

    updateDoorPosition();

    if (checkDist(doorPosition, 2)) {

      nearSomething = true;

    }

  }

  crosshair.classList.toggle(
    "near-interactable",
    nearSomething
  );

}


/* =========================================================
   INTERACTION (PINTU)
========================================================= */

const doorPosition =
  new THREE.Vector3();


let doorOpen = false;


function updateDoorPosition() {

  if (doorMesh) {

    doorMesh.getWorldPosition(
      doorPosition
    );

    return;

  }

  if (!houseLoaded) {

    doorPosition.set(
      0,
      1.2,
      -5
    );


    return;

  }


  doorPosition.set(

    0,

    1.2,

    houseBox.min.z +
    0.5

  );

}


/* =========================================================
   PAUSE
========================================================= */

let gamePaused = false;

pauseBtn?.addEventListener(
  "click",

  () => {

    if (!gameStarted || gameOver) {

      return;

    }

    gamePaused = true;

    gameStarted = false;

    pauseOverlay?.classList.add("active");

    ambienceMusic.pause();

    footstepsAudio.pause();

    caretakerFootstepsAudio.pause();

    if (!chaseMusic.paused) {

      chaseMusic.pause();

    }

  }
);

resumeBtn?.addEventListener(
  "click",

  () => {

    if (!gamePaused) {

      return;

    }

    gamePaused = false;

    gameStarted = true;

    pauseOverlay?.classList.remove("active");

    if (tensionVignetteEl) {

      tensionVignetteEl.style.opacity = 0;

    }

    playAudio(ambienceMusic);

  }
);

quitBtn?.addEventListener(
  "click",

  () => {

    gamePaused = false;

    gameStarted = false;

    gameOver = false;

    pauseOverlay?.classList.remove("active");

    if (tensionVignetteEl) {

      tensionVignetteEl.style.opacity = 0;

    }


    crosshair.style.display = "none";

    joystick.style.display = "none";

    interactBtn.style.display = "none";

    if (crouchBtn) {

      crouchBtn.style.display = "none";

    }

    if (shootBtn) {

      shootBtn.style.display = "none";

    }

    if (ammoCounterEl) {

      ammoCounterEl.style.display = "none";

    }

    if (pauseBtn) {

      pauseBtn.style.display = "none";

    }

    if (inventoryBarEl) {

      inventoryBarEl.style.display = "none";

    }

    setObjective("");


    ambienceMusic.pause();

    footstepsAudio.pause();

    caretakerFootstepsAudio.pause();

    if (!chaseMusic.paused) {

      chaseMusic.pause();

    }


    /*
       Reset state penting biar bisa main
       ulang bersih dari menu.
    */

    caretakerState = "patrol";

    caretakerWaypointIndex = 0;

    caretakerWaypointDirection = 1;

    if (caretaker) {

      caretaker.position.x = caretakerSpawn.x;

      caretaker.position.z = caretakerSpawn.z;

      caretaker.rotation.z = 0;

    }

    hasWeapon = false;

    weaponCollected = false;

    if (weaponPickup) {

      weaponPickup.visible = true;

    }

    keyCollected = false;

    if (keyPickup) {

      keyPickup.visible = true;

    }

    cabinetUnlocked = false;

    if (cabinet) {

      cabinet.material.color.set(0x2c2118);

      if (wallColliders.indexOf(cabinet) === -1) {

        wallColliders.push(cabinet);

      }

    }

    if (flashlightRewardLight) {

      flashlightRewardLight.intensity = 0;

    }

    gunCollected = false;

    gunAmmo = 0;

    if (gunPickup) {

      gunPickup.visible = true;

    }

    ammoPackCollected = false;

    if (ammoPack) {

      ammoPack.visible = true;

    }

    doorLocked = true;

    doorOpen = false;

    if (doorMesh && wallColliders.indexOf(doorMesh) === -1) {

      wallColliders.push(doorMesh);

    }

    if (doorPivot) {

      doorPivot.rotation.y = 0;

    }

    camera.position.copy(spawnPosition);

    player.yaw = Math.PI;

    player.pitch = 0;

    player.groundY =
      spawnPosition.y - player.eyeOffset;


    openMenu();

    menuMusic.currentTime = 0;

    playAudio(menuMusic);

  }
);


/* =========================================================
   CROUCH TOGGLE
========================================================= */

crouchBtn?.addEventListener(
  "click",

  event => {

    event.stopPropagation();

    if (!gameStarted) {

      return;

    }

    player.crouching =
      !player.crouching;

    crouchBtn.classList.toggle(
      "active",
      player.crouching
    );

  }
);


/* =========================================================
   SHOOT (SENJATA JARAK JAUH)
========================================================= */

function updateAmmoUI() {

  if (!ammoCounterEl) {

    return;

  }

  if (!gunCollected) {

    ammoCounterEl.style.display = "none";

    return;

  }

  ammoCounterEl.style.display = "block";

  ammoCounterEl.innerText =
    "Bullets: " + gunAmmo + "/" + MAX_GUN_AMMO;

  if (shootBtn) {

    shootBtn.classList.toggle(
      "no-ammo",
      gunAmmo <= 0
    );

  }

}


const shootDirection =
  new THREE.Vector3();


shootBtn?.addEventListener(
  "click",

  event => {

    event.stopPropagation();

    if (!gameStarted || gameOver) {

      return;

    }

    if (!gunCollected || gunAmmo <= 0) {

      showMessage("Out of bullets!");

      return;

    }

    gunAmmo -= 1;

    updateAmmoUI();

    triggerMuzzleFlash();

    gunshotAudio.currentTime = 0;

    playAudio(gunshotAudio);


    /*
       Tembak lurus dari arah kamera (crosshair
       di tengah layar = titik bidik).
    */

    camera.getWorldDirection(shootDirection);

    raycaster.set(
      camera.position,
      shootDirection
    );

    raycaster.far = 22;


    let didHitCaretaker = false;

    if (
      caretaker &&
      caretakerState !== "stunned"
    ) {

      const hits =
        raycaster.intersectObject(caretaker, true);

      /*
         Pastikan nggak ada tembok di antara
         player dan Caretaker sebelum peluru
         "sah" kena (nggak bisa tembus tembok).
      */

      if (hits.length > 0) {

        const wallHits =
          raycaster.intersectObjects(wallColliders, false);

        const blockedByWall =
          wallHits.length > 0 &&
          wallHits[0].distance < hits[0].distance;

        if (!blockedByWall) {

          didHitCaretaker = true;

        }

      }

    }

    if (didHitCaretaker) {

      stunCaretaker();

      showMessage("Direct hit! The Caretaker goes down.");

    }
    else {

      showMessage("Missed!");

    }

  }
);


interactBtn?.addEventListener(
  "click",

  event => {

    event.stopPropagation();


    if (!gameStarted) {

      return;

    }


    /*
       PRIORITAS 1: SERANG MUSUH

       Kalau punya senjata dan Caretaker
       lagi deket (< 2 unit), serang -> musuh
       pingsan 15 detik.
    */

    if (
      hasWeapon &&
      caretaker &&
      caretakerState !== "stunned"
    ) {

      const distToCaretaker =
        camera.position.distanceTo(
          caretaker.position
        );

      if (distToCaretaker < 2.2) {

        stunCaretaker();

        return;

      }

    }


    /*
       PRIORITAS 2: AMBIL SENJATA
    */

    if (!weaponCollected) {

      const distToWeapon =
        camera.position.distanceTo(
          weaponPickupPosition
        );

      if (distToWeapon < 1.8) {

        weaponCollected = true;

        updateInventoryUI();

        hasWeapon = true;

        weaponPickup.visible = false;

        showMessage(
          "You picked up a wooden bat."
        );

        return;

      }

    }


    /*
       PRIORITAS 3: AMBIL KUNCI
    */

    if (!keyCollected) {

      const distToKey =
        camera.position.distanceTo(
          keyPickupPosition
        );

      if (distToKey < 1.6) {

        keyCollected = true;

        updateInventoryUI();

        keyPickup.visible = false;

        setObjective(
          "Bring the key to the locked cabinet in the Living Room."
        );

        showMessage(
          "You found a small key under the pillow."
        );

        return;

      }

    }


    /*
       PRIORITAS 4: BUKA LEMARI TERKUNCI
    */

    if (!cabinetUnlocked) {

      const distToCabinet =
        camera.position.distanceTo(
          cabinetPosition
        );

      if (distToCabinet < 1.8) {

        if (keyCollected) {

          cabinetUnlocked = true;

          const cabinetIndex =

          updateInventoryUI();
            wallColliders.indexOf(cabinet);

          if (cabinetIndex !== -1) {

            wallColliders.splice(cabinetIndex, 1);

          }

          cabinet.material.color.set(0x1a130d);

          flashlightRewardLight.intensity = 6;

          doorLocked = false;

          setObjective(
            "The front door is unlocked! Get out before The Caretaker finds you."
          );

          showMessage(
            "You unlocked the cabinet and found a flashlight! The front door is now unlocked."
          );

        }
        else {

          showMessage(
            "The cabinet is locked. Maybe there's a key somewhere."
          );

        }

        return;

      }

    }


    /*
       PRIORITAS 5: BUKA RAK BUKU (RUANGAN RAHASIA)
    */

    if (!secretRoomOpen) {

      const distToBookshelf =
        camera.position.distanceTo(
          bookshelfPosition
        );

      if (distToBookshelf < 1.8) {

        secretRoomOpen = true;

        const bookshelfIndex =
          wallColliders.indexOf(bookshelf);

        if (bookshelfIndex !== -1) {

          wallColliders.splice(bookshelfIndex, 1);

        }

        bookshelf.rotation.y = Math.PI / 2.2;

        showMessage(
          "The bookshelf slides aside, revealing a hidden room..."
        );

        return;

      }

    }


    /*
       PRIORITAS 6: AMBIL PISTOL
    */

    if (!gunCollected) {

      const distToGun =
        camera.position.distanceTo(
          gunPickupPosition
        );

      if (distToGun < 1.6) {

        gunCollected = true;

        gunAmmo = MAX_GUN_AMMO;

        updateInventoryUI();

        gunPickup.visible = false;

        if (shootBtn) {

          shootBtn.style.display = "block";

        }

        updateAmmoUI();

        showMessage(
          "You found a pistol with " + MAX_GUN_AMMO + " bullets!"
        );

        return;

      }

    }


    /*
       PRIORITAS 7: AMBIL AMMO PACK
    */

    if (!ammoPackCollected) {

      const distToAmmoPack =
        camera.position.distanceTo(
          ammoPackPosition
        );

      if (distToAmmoPack < 1.6) {

        ammoPackCollected = true;

        ammoPack.visible = false;

        if (gunCollected) {

          gunAmmo =
            Math.min(
              gunAmmo + AMMO_PACK_REFILL,
              MAX_GUN_AMMO
            );

          updateAmmoUI();

          showMessage(
            "You found " + AMMO_PACK_REFILL + " more bullets!"
          );

        }
        else {

          showMessage(
            "You found a box of bullets. Find a gun to use them."
          );

        }

        return;

      }

    }


    /*
       PRIORITAS 8: BACA NOTE (LORE)
    */

    const distToNote =
      camera.position.distanceTo(
        notePosition
      );

    if (distToNote < 1.6) {

      showMessage(noteText, 6000);

      noteRead = true;

      return;

    }


    updateDoorPosition();


    const playerXZ =
      new THREE.Vector2(

        camera.position.x,

        camera.position.z

      );


    const doorXZ =
      new THREE.Vector2(

        doorPosition.x,

        doorPosition.z

      );


    const distance =
      playerXZ.distanceTo(
        doorXZ
      );


    if (
      distance < 2
    ) {

      doorAudio.currentTime =
        0;


      playAudio(
        doorAudio
      );


      if (doorLocked) {

        showMessage(
          "The door is locked from the outside world. Find a way to unlock it inside the house."
        );

      }
      else if (doorMesh && !doorOpen) {

        /*
           Rotasi lewat doorPivot (posisinya
           tepat di engsel), jadi pintu berputar
           dari tepi seperti pintu asli, bukan
           dari titik tengah.
        */

        if (doorPivot) {

          doorPivot.rotation.y +=
            Math.PI / 1.7;

        }
        else {

          doorMesh.rotation.y +=
            Math.PI / 2;

        }


        doorOpen = true;


        /*
           Hapus doorMesh dari wallColliders
           supaya beneran bisa dilewati setelah
           kebuka (bukan cuma kebuka secara visual).
        */

        const colliderIndex =
          wallColliders.indexOf(doorMesh);

        if (colliderIndex !== -1) {

          wallColliders.splice(
            colliderIndex,
            1
          );

        }


        showMessage("The door creaks open.");

      }
      else if (doorMesh && doorOpen) {

        /*
           TOGGLE: pintu yang lagi kebuka,
           di-INTERACT lagi -> ditutup.
        */

        if (doorPivot) {

          doorPivot.rotation.y = 0;

        }
        else {

          doorMesh.rotation.y = 0;

        }


        doorOpen = false;


        if (
          wallColliders.indexOf(doorMesh) === -1
        ) {

          wallColliders.push(doorMesh);

        }


        showMessage("You close the door.");

      }
      else {

        showMessage("The door is locked.");

      }

    }

    else {

      showMessage(
        "Nothing to interact with."
      );

    }

  }
);


/* =========================================================
   MESSAGE
========================================================= */

function showMessage(
  text,
  duration
) {

  if (!message) {

    return;

  }


  message.innerText =
    text;


  message.style.display =
    "block";


  clearTimeout(
    showMessage.timer
  );


  showMessage.timer =
    setTimeout(
      () => {

        message.style.display =
          "none";

      },

      duration || 1500
    );

}


/* =========================================================
   GAME LOOP
========================================================= */

const clock =
  new THREE.Clock();


function animate() {

  requestAnimationFrame(
    animate
  );


  const delta =
    Math.min(

      clock.getDelta(),

      0.05

    );


  updatePlayer(delta);


  animateWeaponPickup(
    performance.now()
  );

  animateKeyPickup(
    performance.now()
  );

  animateGunPickup(
    performance.now()
  );

  updateMuzzleFlash(delta);



  updateCaretaker(
    delta
  );


  if (
    caretakerMixer &&
    gameStarted &&
    caretakerState !== "stunned"
  ) {

    caretakerMixer.update(
      delta
    );

  }


  renderer.render(
    scene,
    camera
  );

}


animate();


/* =========================================================
   RESIZE
========================================================= */

function resizeGame() {

  const viewport =
    getViewportSize();


  camera.aspect =

    viewport.width /

    viewport.height;


  camera.updateProjectionMatrix();


  renderer.setSize(

    viewport.width,

    viewport.height

  );

}


window.addEventListener(
  "resize",
  resizeGame
);


window.addEventListener(
  "orientationchange",

  () => {

    setTimeout(
      resizeGame,
      200
    );

  }
);


/* =========================================================
   VISIBILITY / AUDIO
========================================================= */

document.addEventListener(
  "visibilitychange",

  () => {

    if (
      document.hidden
    ) {

      footstepsAudio.pause();

    }

  }
);


console.log(
  "THE LAST DOOR - FIXED VERSION LOADED"
);
