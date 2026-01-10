import * as Icons from "react-icons/pi";

interface CardProp {
  iconName: string;
}

export default function PiIcons({ iconName }: CardProp) {
  const IconComponent = Icons[iconName as keyof typeof Icons];

  return IconComponent ? <IconComponent className="text-xl" /> : null;
}
