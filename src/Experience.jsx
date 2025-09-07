import { CameraControls, Text, Html, ContactShadows, PresentationControls, Float, Environment, useGLTF } from '@react-three/drei'
import { Camera } from 'three'
import { useEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber';
import {soundOn, soundOff} from './assets/icons/index.js';
import audioDevfolio from '../public/music/dev.mp3';

export default function Experience() {
    //Loads a MacBook 3D model.
    const computer = useGLTF('https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/macbook/model.gltf')


    //State to handle the color change of the sphere on click.
    const controls = useRef();
    const audioRef = useRef(null)
    const [isPlayingMusic, setIsPlayingMusic] = useState(false);
    const intro = async () => {
        controls.current.dolly(-22)
        controls.current.smoothTime = 1.6
        controls.current.dolly(22, true)
        controls.current.minDistance = 2
        controls.current.maxDistance = 6
        controls.current.minPolarAngle = Math.PI / 6
        controls.current.maxPolarAngle = Math.PI - Math.PI / 6
        controls.current.minAzimuthAngle = -Math.PI / 4
        controls.current.maxAzimuthAngle = Math.PI / 4
    }


// Setup audio and autoplay on mount
useEffect(() => {
  audioRef.current = new Audio(audioDevfolio)
  audioRef.current.loop = true

  // Try to autoplay
  const playAudio = async () => {
    try {
      await audioRef.current.play()
      setIsPlayingMusic(true) // only set true if browser allows
    } catch (err) {
      console.warn("Autoplay blocked by browser:", err)
      // user can click the toggle
    }
  }

  playAudio()

  return () => {
    if (audioRef.current) audioRef.current.pause()
  }
}, [])

// React to play/pause state (for toggle button)
useEffect(() => {
  if (!audioRef.current) return
  if (isPlayingMusic) {
    audioRef.current.play().catch(err => console.warn("Play error:", err))
  } else {
    audioRef.current.pause()
  }
}, [isPlayingMusic])

    useEffect(() => {
    intro()
  }, [])

    // Freeze orbital controls while scrolling on small screens
    useEffect(() => {
      const isMobile = window.innerWidth < 1024;
      if (!isMobile || !controls.current) return;

      let timeoutId = null;
      const freezeControls = () => {
        if (controls.current) controls.current.enabled = false;
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          if (controls.current) controls.current.enabled = true;
        }, 350);
      };

      window.addEventListener('touchmove', freezeControls, { passive: true });
      window.addEventListener('scroll', freezeControls, { passive: true });

      return () => {
        window.removeEventListener('touchmove', freezeControls);
        window.removeEventListener('scroll', freezeControls);
        clearTimeout(timeoutId);
        if (controls.current) controls.current.enabled = true;
      };
    }, []);


    return <>


        <Environment preset='city' />

        
        <color args={['#000']} attach="background" />


        <PresentationControls
            global
            rotation={[.14, .1, .0]}
            polar={[-0.4, 0.2]}
            azimuth={[-1, 0.75]}
            config={{ mass: 2, tension: 400 }}
            snap={{ mass: 2, tension: 400 }}
        >


            <Float rotationIntensity={0.3}>


                <rectAreaLight
                    width={2.5}
                    height={1.65}
                    intensity={65}
                    color={"#d9d9c3"}
                    rotation={[0.1, Math.PI, 0]}
                    position={[0, .55, -1.15]}
                />


                <primitive
                    object={computer.scene}
                    position-y={- 1.2}
                >
                    <Html
                        transform
                        wrapperClass="htmlScreen"
                        distanceFactor={1.17}
                        position={[0, 1.56, -1.4]}
                        rotation-x={-.256}
                    >
                        <iframe src='https://hr-devfolio.netlify.app/' />
                    </Html>


                </primitive>
                <Text
                    font={"./Arimo-VariableFont_wght.ttf"}
                    fontSize={.5}
                    position={[2, .75, .75]}
                    rotation-y={-1.25}
                    children={'Helitha\rRupasinghe'}
                    textAlign="center"
                >

                </Text>
            </Float>
        </PresentationControls>

        <CameraControls
            ref={controls}
        >
        </CameraControls>

        <ContactShadows position-y={-1.4}
            opacity={0.4}
            scale={5}
            blur={2.4}
        />
        <Html fullscreen>
        <div className='hidden-icon-desktop'>
            <img
            src={isPlayingMusic ? soundOn : soundOff}
            alt="sound"
            className='w-5 h-5 cursor-pointer object-contain'
            onClick={() => setIsPlayingMusic(prev => !prev)}
            />
        </div>
        </Html>
    </>


}