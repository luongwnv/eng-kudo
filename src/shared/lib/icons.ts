import { createElement } from "lucide";
import type { IconNode } from "lucide";
import {
  BookOpen,
  Zap,
  Flame,
  BarChart3,
  Trophy,
  Settings,
  ArrowLeft,
  Check,
  X,
  ArrowRight,
  RotateCcw,
  Heart,
  Star,
  Clock,
  Target,
  Award,
  TrendingUp,
  Calendar,
  Keyboard,
  MousePointerClick,
  Home,
  ChevronRight,
  Lock,
  Sun,
  Moon,
  Monitor,
  Play,
  Sparkles,
  CircleCheck,
  CircleX,
  CircleArrowRight,
  Shield,
  Sword,
  Skull,
  AlertTriangle,
  Trash2,
  Palette,
  Gamepad2,
} from "lucide";

export function icon(
  node: IconNode,
  options: { size?: number; class?: string; strokeWidth?: number } = {},
): SVGElement {
  const { size = 20, class: className, strokeWidth = 2 } = options;
  const el = createElement(node) as unknown as SVGElement;
  el.setAttribute("width", String(size));
  el.setAttribute("height", String(size));
  el.setAttribute("stroke-width", String(strokeWidth));
  if (className) el.setAttribute("class", className);
  return el;
}

// Re-export icon nodes for use
export {
  BookOpen,
  Zap,
  Flame,
  BarChart3,
  Trophy,
  Settings,
  ArrowLeft,
  Check,
  X,
  ArrowRight,
  RotateCcw,
  Heart,
  Star,
  Clock,
  Target,
  Award,
  TrendingUp,
  Calendar,
  Keyboard,
  MousePointerClick,
  Home,
  ChevronRight,
  Lock,
  Sun,
  Moon,
  Monitor,
  Play,
  Sparkles,
  CircleCheck,
  CircleX,
  CircleArrowRight,
  Shield,
  Sword,
  Skull,
  AlertTriangle,
  Trash2,
  Palette,
  Gamepad2,
};
