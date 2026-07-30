import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { SHOP_ACCESSORIES } from "../data/accessories";
import Mascot from "../components/Mascot";
import Button from "../components/Button";
import Icon from "../components/Icon";
import { useSound } from "../hooks/useSound";
import { popIn } from "../lib/motion";

export default function Shop({ progress, onPurchase }) {
  const navigate = useNavigate();
  const sound = useSound();
  const owned = progress.unlockedAccessories || [];

  return (
    <div className="min-h-screen flex flex-col app-bg">
      <header
        className="sticky top-0 z-10"
        style={{ background: "linear-gradient(135deg, #C25A3D, var(--color-brand-coral))" }}
      >
        <div className="max-w-md md:max-w-xl mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                sound.click();
                navigate("/");
              }}
              aria-label="Back"
              className="text-2xl font-bold text-white"
            >
              ✕
            </button>
            <h1 className="font-display font-extrabold text-lg text-white">Shop</h1>
          </div>
          <span className="text-white font-extrabold text-sm flex items-center gap-1">
            <Icon name="gem" size={16} />
            {progress.gems}
          </span>
        </div>
      </header>

      <div className="max-w-md md:max-w-xl w-full mx-auto px-4 py-6 flex flex-col gap-3">
        <div className="flex justify-center py-2">
          <Mascot mascotId="saba" mood="happy" size={100} accessories={owned} />
        </div>
        <p className="text-sm font-bold text-center" style={{ color: "var(--color-brand-ink-light)" }}>
          Spend gems earned from lessons and quests on cosmetic accessories for your mascot.
        </p>

        {SHOP_ACCESSORIES.map((item, i) => {
          const isOwned = owned.includes(item.id);
          const canAfford = progress.gems >= item.cost;
          return (
            <motion.div
              key={item.id}
              initial={popIn.initial}
              animate={popIn.animate}
              transition={{ ...popIn.transition, delay: i * 0.05 }}
              className="rounded-2xl p-4 flex items-center gap-4 card-soft"
            >
              <span
                className="flex items-center justify-center rounded-full shrink-0"
                style={{ width: 44, height: 44, background: "var(--color-brand-teal-light)", color: "var(--color-brand-teal-dark)" }}
              >
                <Icon name={item.icon} size={22} />
              </span>
              <div className="flex-1">
                <p className="font-extrabold" style={{ color: "var(--color-brand-ink)" }}>
                  {item.name}
                </p>
                {!isOwned && (
                  <p className="text-sm font-bold flex items-center gap-1" style={{ color: "var(--color-brand-yellow-dark)" }}>
                    <Icon name="gem" size={14} />
                    {item.cost} gems
                  </p>
                )}
              </div>
              {isOwned ? (
                <span className="text-xs font-extrabold uppercase tracking-wide" style={{ color: "var(--color-brand-teal-dark)" }}>
                  Owned ✓
                </span>
              ) : (
                <Button
                  variant={canAfford ? "yellow" : "white"}
                  className="!py-2 !px-4 text-xs uppercase tracking-wide"
                  disabled={!canAfford}
                  onClick={() => onPurchase(item.id, item.cost)}
                >
                  Buy
                </Button>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
