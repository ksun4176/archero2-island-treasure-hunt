import Image from "next/image";
import { basePath } from "@/utils/constants";

const tiles = [
    { left: 149, top: 88, src: "purple.png", pos: 14 },
    { left: 123, top: 106, src: "green.png", pos: 13 },
    { left: 97, top: 124, src: "blue.png", pos: 12 },
    { left: 71, top: 142, src: "white.png", pos: 11 },
    { left: 97, top: 160, src: "yellow.png", pos: 10 },
    { left: 71, top: 178, src: "green.png", pos: 9 },
    { left: 97, top: 196, src: "big_purple.png", pos: 8 },
    { left: 71, top: 214, src: "green.png", pos: 7 },
    { left: 45, top: 232, src: "purple.png", pos: 6 },
    { left: 71, top: 250, src: "white.png", pos: 5 },
    { left: 97, top: 268, src: "yellow.png", pos: 4 },
    { left: 123, top: 286, src: "purple.png", pos: 3 },
    { left: 175, top: 106, src: "blue.png", pos: 15 },
    { left: 201, top: 124, src: "yellow.png", pos: 16 },
    { left: 227, top: 142, src: "green.png", pos: 17 },
    { left: 253, top: 160, src: "white.png", pos: 18 },
    { left: 227, top: 178, src: "blue.png", pos: 19 },
    { left: 201, top: 196, src: "yellow.png", pos: 20 },
    { left: 227, top: 214, src: "green.png", pos: 21 },
    { left: 253, top: 232, src: "big_purple.png", pos: 22 },
    { left: 227, top: 250, src: "blue.png", pos: 23 },
    { left: 201, top: 268, src: "purple.png", pos: 24 },
    { left: 175, top: 286, src: "green.png", pos: 1 },
    { left: 149, top: 304, src: "white.png", pos: 2 },
];

export default function MonopolyMap() {
    return (
        <div className="relative w-[350px] h-[370px] mx-auto lg:ml-4 mb-4 lg:mb-0">
            {/* Background image */}
            <Image
                src={`${basePath}/tiles/bg-monopoly.png`}
                alt="Monopoly Map Background"
                fill
                className="object-contain"
                priority
                unoptimized
            />

            {/* Tiles with hover shine */}
            {tiles.map((tile, i) => (
                <div
                    key={i}
                    className="absolute"
                    style={{ left: `${tile.left}px`, top: `${tile.top}px`, width: 46, height: 46 }}
                >
                    <Image
                        src={`${basePath}/tiles/${tile.src}`}
                        alt={`Tile ${tile.pos}`}
                        width={46}
                        height={46}
                        unoptimized
                    />
                    <Image
                        src={`${basePath}/tiles/shine.png`}
                        alt="Shine"
                        width={46}
                        height={46}
                        unoptimized
                        className="absolute top-[-16px] left-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
                    />
                </div>
            ))}
        </div>
    );
}
