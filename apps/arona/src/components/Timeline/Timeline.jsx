export default function Timeline() {
  return (
    <div className="timeline mt-5 h-10">
      <div className="timeline-bg flex justify-between">
        {
          Array.from({ length: 24 }).map((_, index) => {
            return (
              <div className="node w-2 h-5 bg-white rounded" key={index + 1}></div>
            )
          })
        }
      </div>
    </div>
  )
}
