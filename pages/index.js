import Typewriter from "typewriter-effect";

export default function Home() {
  return (
    <div className='bg-black text-white grid place-items-center'>
      <div className="typewriter">
        <Typewriter options={{
          loop: true
        }}
          onInit={(typewriter) => {
            typewriter
              .typeString("AGGREGATE DEXES")
              .pauseFor(1000)
              .deleteAll()
              .typeString("AI ANALYSIS")
              .pauseFor(1000)
              .deleteAll()
              .typeString("REPUTATION SCORES")
              .pauseFor(1000)
              .deleteAll()
              .typeString("TRANSPARENCY")
              .start()
          }}
        />
      </div>
    </div>
  )
}
