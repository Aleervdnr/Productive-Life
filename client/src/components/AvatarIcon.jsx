 export function AvatarIcon({ name }) {
  return (
    <>
      <div className="bg-dark-500 border-violet-main border-2 text-neutral-content w-20 h-20 rounded-full grid justify-items-center items-center">
        <span className="text-3xl capitalize">{name.charAt(0)}</span>
      </div>

      <span className="font-semibold text-xl mt-[2px] ">{name.split(" ")[0]}</span>
    </>
  );
}

export function AvatarIconSkeleton(){
    return(
        <>
            <div className="bg-dark-500 w-20 h-20 animate-pulse rounded-full m-1"></div>
            <span className="bg-dark-500  rounded animate-pulse w-14 h-4"></span>
        </>
    )
}
