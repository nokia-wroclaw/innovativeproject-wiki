type Node = {
  text: string;
  level: number;
  open?: boolean;
  children?: Node[];
};

export type { Node };
