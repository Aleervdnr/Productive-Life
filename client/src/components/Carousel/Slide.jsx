export default function Slide({children,img}) {
    return (
      <div className="grid justify-items-center gap-5">
          {children}
          <img src={img} alt="" />
      </div>
    )
  }