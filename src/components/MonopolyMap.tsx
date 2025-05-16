import { useState } from "react";
import Image from "next/image";
import { basePath } from "@/utils/constants";
import styles from "./MonopolyMap.module.css";

const tiles = [
    { left: 149, top: 88, pos: 14 },
    { left: 123, top: 106, pos: 13 },
    { left: 97, top: 124, pos: 12 },
    { left: 71, top: 142, pos: 11 },
    { left: 97, top: 160, pos: 10 },
    { left: 71, top: 178, pos: 9 },
    { left: 97, top: 196, pos: 8 },
    { left: 71, top: 214, pos: 7 },
    { left: 45, top: 232, pos: 6 },
    { left: 71, top: 250, pos: 5 },
    { left: 97, top: 268, pos: 4 },
    { left: 123, top: 286, pos: 3 },
    { left: 175, top: 106, pos: 15 },
    { left: 201, top: 124, pos: 16 },
    { left: 227, top: 142, pos: 17 },
    { left: 253, top: 160, pos: 18 },
    { left: 227, top: 178, pos: 19 },
    { left: 201, top: 196, pos: 20 },
    { left: 227, top: 214, pos: 21 },
    { left: 253, top: 232, pos: 22 },
    { left: 227, top: 250, pos: 23 },
    { left: 201, top: 268, pos: 24 },
    { left: 175, top: 286, pos: 1 },
    { left: 149, top: 304, pos: 2 },
];

export default function MonopolyMap({ multipliers }: { multipliers: number[] }) {
    return (
        <div className="relative w-[350px] h-[370px] mx-auto lg:ml-4 mb-4 lg:mb-0">
            <Image
                src={`${basePath}/tiles/bg-monopoly.png`}
                alt="Monopoly Map Background"
                fill
                className="object-contain"
                priority
                unoptimized
            />

            {tiles.map((tile, i) => {
                const multiplier = multipliers?.[tile.pos - 1]; // tile.pos is 1-based
                return (
                    <div
                        key={i}
                        className={styles.tile}
                        style={{ left: `${tile.left}px`, top: `${tile.top}px` }}
                    >
                        <Image
                            src={`${basePath}/tiles/tile_${multiplier || 1}.png`}
                            alt={`Tile ${tile.pos}`}
                            width={46}
                            height={46}
                            unoptimized
                            className={styles.imageTile}
                        />
                        <Image
                            src={`${basePath}/tiles/shine.png`}
                            alt="Shine"
                            width={46}
                            height={46}
                            unoptimized
                            className={styles.shine}
                        />
                    </div>
                );
            })}
        </div>
    );
}