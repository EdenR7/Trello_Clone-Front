function CardDetailsHeader({ title }: { title: string }) {
  return (
    <h3 className=" text-gray-600 overflow-hidden whitespace-nowrap text-ellipsis mb-1 text-sm font-semibold leading-5">
      {title}
    </h3>
  );
}

export default CardDetailsHeader;
