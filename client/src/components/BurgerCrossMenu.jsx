export function BurgerMenu({setMenu}) {
  return (
    <div className="grid gap-[6px] lg:hidden" onClick={() => setMenu()}>
      <div className="w-[25px] h-[1px] bg-white"></div>
      <div className="w-[25px] h-[1px] bg-white"></div>
      <div className="w-[25px] h-[1px] bg-white"></div>
    </div>
  );
}

export function CrossMenu({setMenu}) {
  return (
    <div className="relative h-[25px] w-[25px] lg:hidden" onClick={() => setMenu()}>
      <div className="w-[30px] h-[1px] bg-white absolute top-3 left-[-2px] rotate-45"></div>
      <div className="w-[30px] h-[1px] bg-white absolute top-3 left-[-2px] rotate-[-45deg]"></div>
    </div>
  );
}
