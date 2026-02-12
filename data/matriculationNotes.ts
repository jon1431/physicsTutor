
import type { Subject } from '../types';

export const MATRICULATION_NOTES: Subject[] = [
    {
        name: 'Physics',
        semesters: [
            {
                semester: 1,
                chapters: [
                    {
                        id: 1,
                        title: 'Physical Quantities and Units',
                        content: `
### 1.1 Base & Derived Quantities
- **Base Quantities**: Fundamental quantities (e.g., Length [$m$], Mass [$kg$], Time [$s$], Temperature [$K$], Current [$A$]).
- **Derived Quantities**: Combinations of base quantities (e.g., Velocity [$ms^{-1}$], Force [$kgms^{-2}$ or $N$]).

### 1.2 Dimensional Analysis
- Compare dimensions $[L], [M], [T]$ to verify equation consistency.

### 1.3 Scalars and Vectors
- **Scalar**: Magnitude only.
- **Vector**: Magnitude and direction. Resolution: $F_x = F \\cos(\\theta)$, $F_y = F \\sin(\\theta)$.
                        `
                    },
                    {
                        id: 2,
                        title: 'Kinematics of Linear Motion',
                        content: `
### 2.2 Equations of Motion
1. $v = u + at$
2. $s = ut + \\frac{1}{2}at^2$
3. $v^2 = u^2 + 2as$
                        `
                    }
                ]
            }
        ]
    }
];
