
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
- A method to check the validity of an equation by comparing the dimensions on both sides.
- Dimensions: Length $[L]$, Mass $[M]$, Time $[T]$.
- An equation is dimensionally consistent if the dimensions on both sides match.

### 1.3 Scalars and Vectors
- **Scalar**: A quantity with magnitude only (e.g., speed, distance, energy).
- **Vector**: A quantity with both magnitude and direction (e.g., velocity, displacement, force).
- **Vector Resolution**: Breaking a vector into its perpendicular components (usually x and y).
  - $F_x = F \\cos(\\theta)$
  - $F_y = F \\sin(\\theta)$
                        `
                    },
                    {
                        id: 2,
                        title: 'Kinematics of Linear Motion',
                        content: `
### 2.1 Displacement, Velocity, and Acceleration
- **Displacement ($s$)**: Change in position (vector).
- **Velocity ($v$)**: Rate of change of displacement (vector).
- **Acceleration ($a$)**: Rate of change of velocity (vector).

### 2.2 Equations of Motion (Constant Acceleration)
- Applicable only when acceleration $a$ is constant.
  1. $v = u + at$
  2. $s = ut + \\frac{1}{2}at^2$
  3. $v^2 = u^2 + 2as$
  4. $s = \\frac{1}{2}(u+v)t$

### 2.3 Projectile Motion
- Motion of an object under the influence of gravity only.
- **Horizontal (x-component)**: Constant velocity ($a_x = 0$).
- **Vertical (y-component)**: Constant acceleration ($a_y = -g$).
                        `
                    },
                    {
                        id: 3,
                        title: 'Dynamics of Linear Motion',
                        content: `
### 3.1 Newton's Laws of Motion
- **First Law (Inertia)**: An object at rest stays at rest and an object in motion stays in motion with the same speed and in the same direction unless acted upon by an unbalanced force.
- **Second Law**: The rate of change of momentum is proportional to the net force applied. $F_{net} = ma$.
- **Third Law**: For every action, there is an equal and opposite reaction.

### 3.2 Momentum and Impulse
- **Linear Momentum ($p$)**: Product of mass and velocity. $p = mv$.
- **Principle of Conservation of Momentum**: In an isolated system, the total momentum remains constant. $\\Sigma p_{initial} = \\Sigma p_{final}$.
- **Impulse ($J$)**: Change in momentum. $J = F\\Delta t = \\Delta p$.
                        `
                    },
                    {
                        id: 4,
                        title: 'Work, Energy and Power',
                        content: `
### 4.1 Work
- **Work Done ($W$)** by a constant force is the product of the force and the displacement in the direction of the force. $W = Fs \\cos(\\theta)$.

### 4.2 Energy
- **Kinetic Energy ($KE$)**: Energy of motion. $KE = \\frac{1}{2}mv^2$.
- **Potential Energy ($PE$)**: Stored energy.
  - Gravitational PE: $U = mgh$
  - Elastic PE (spring): $U = \\frac{1}{2}kx^2$
- **Principle of Conservation of Energy**: Energy cannot be created or destroyed, only transformed from one form to another. Total energy in an isolated system is constant.

### 4.3 Power
- **Power ($P$)**: The rate at which work is done or energy is transferred. $P = \\frac{W}{t} = Fv$.
                        `
                    },
                    {
                        id: 5,
                        title: 'Circular Motion',
                        content: `
### 5.1 Uniform Circular Motion
- Motion in a circle at a constant speed.
- Velocity is always changing (direction changes), so there is acceleration.

### 5.2 Centripetal Force and Acceleration
- **Centripetal Acceleration ($a_c$)**: Acceleration directed towards the center of the circle. $a_c = \\frac{v^2}{r} = r w^2$.
- **Centripetal Force ($F_c$)**: The net force required to keep an object in circular motion, directed towards the center. $F_c = ma_c = \\frac{mv^2}{r}$. This force is provided by other forces like tension, gravity, or friction.
                        `
                    },
                    {
                        id: 6,
                        title: 'Gravitation',
                        content: `
### 6.1 Newton's Law of Universal Gravitation
- The gravitational force between two point masses is directly proportional to the product of their masses and inversely proportional to the square of the distance between their centers.
- Formula: $F = \\frac{G m_1 m_2}{r^2}$, where $G$ is the gravitational constant.

### 6.2 Gravitational Field Strength ($g$)
- The gravitational force per unit mass at a point. $g = \\frac{F}{m} = \\frac{GM}{r^2}$.

### 6.3 Gravitational Potential Energy ($U$)
- The work done to bring a mass from infinity to a point in a gravitational field.
- Formula: $U = -\\frac{G M m}{r}$.
                        `
                    },
                     {
                        id: 7,
                        title: 'Simple Harmonic Motion (SHM)',
                        content: `
### 7.1 Definition of SHM
- A periodic motion where the acceleration is directly proportional to the displacement from the equilibrium position and is always directed towards the equilibrium position.
- Condition: $a = -w^2 x$.

### 7.2 Equations of SHM
- **Displacement ($x$)**: $x = A \\sin(w t + \\phi)$
- **Velocity ($v$)**: $v = A w \\cos(w t + \\phi)$
- **Acceleration ($a$)**: $a = -A w^2 \\sin(w t + \\phi)$
- **Angular Frequency ($w$)**: $w = 2\\pi f = \\frac{2\\pi}{T}$.
                        `
                    },
                    {
                        id: 8,
                        title: 'Mechanical Waves and Sound',
                        content: `
### 8.1 Wave Properties
- **Wave**: A disturbance that transfers energy without transferring matter.
- **Transverse Wave**: Oscillation is perpendicular to wave propagation (e.g., light).
- **Longitudinal Wave**: Oscillation is parallel to wave propagation (e.g., sound).
- **Wave Equation**: $v = f \\lambda$.

### 8.2 Superposition and Interference
- **Principle of Superposition**: When two or more waves overlap, the resultant displacement is the vector sum of the individual displacements.
- **Interference**: Constructive (in phase) and destructive (out of phase) superposition.

### 8.3 Sound Intensity
- The rate of energy flow per unit area. $I = \\frac{P}{A}$.
                        `
                    },
                    {
                        id: 9,
                        title: 'Thermal Physics',
                        content: `
### 9.1 Thermal Equilibrium and Temperature
- **Zeroth Law of Thermodynamics**: If two systems are in thermal equilibrium with a third system, they are in thermal equilibrium with each other.
- **Temperature**: A measure of the average kinetic energy of the particles.

### 9.2 Heat Transfer
- **Conduction**: Heat transfer through direct contact.
- **Convection**: Heat transfer through the movement of fluids.
- **Radiation**: Heat transfer through electromagnetic waves.
                        `
                    },
                    {
                        id: 10,
                        title: 'Ideal Gases',
                        content: `
### 10.1 Ideal Gas Law
- An equation of state for a hypothetical ideal gas.
- Formula: $PV = nRT$.
  - $P$: Pressure, $V$: Volume, $n$: moles, $R$: Ideal gas constant, $T$: Absolute temperature (Kelvin).

### 10.2 Kinetic Theory of Gases
- A model that explains the macroscopic properties of gases (pressure, temperature) by considering the microscopic motion of their constituent atoms or molecules.
- Key assumptions: Large number of particles in random motion, negligible volume, elastic collisions.
                        `
                    }
                ]
            },
            {
                semester: 2,
                chapters: [
                    {
                        id: 1,
                        title: 'Electrostatics',
                        content: `
### 1.1 Coulomb's Law
- The electrostatic force ($F$) between two point charges ($q_1, q_2$) is directly proportional to the product of the charges and inversely proportional to the square of the distance ($r$) between them.
- Formula: $F = k \\frac{|q_1 q_2|}{r^2}$

### 1.2 Electric Field
- A region around a charged object where another charged object experiences an electrostatic force.
- **Electric Field Strength ($E$)**: Force per unit positive charge. $E = \\frac{F}{q}$.
- For a point charge: $E = \\frac{kQ}{r^2}$.

### 1.3 Electric Potential
- **Electric Potential ($V$)**: Work done per unit positive charge to bring a charge from infinity to a point in an electric field. $V = \\frac{W}{q}$.
- For a point charge: $V = \\frac{kQ}{r}$.
                        `
                    },
                    {
                        id: 2,
                        title: 'Capacitors',
                        content: `
### 2.1 Capacitance
- A capacitor is a device that stores electrical energy in an electric field.
- **Capacitance ($C$)**: The ratio of the magnitude of the charge ($Q$) on either conductor to the magnitude of the potential difference ($V$) between them. $C = \\frac{Q}{V}$.
- Unit: Farad ($F$).

### 2.2 Capacitors in Series and Parallel
- **In Series**: The total capacitance is less than any individual capacitor's capacitance. $\\frac{1}{C_{total}} = \\frac{1}{C_1} + \\frac{1}{C_2} + \\dots$
- **In Parallel**: $C_{total} = C_1 + C_2 + \\dots$

### 2.3 Energy Stored in a Capacitor
- $U = \\frac{1}{2}QV = \\frac{1}{2}CV^2 = \\frac{Q^2}{2C}$
                        `
                    },
                    {
                        id: 3,
                        title: 'Electric Current & DC Circuits',
                        content: `
### 3.1 Electric Current
- The rate of flow of electric charge. $I = \\frac{dQ}{dt}$.
- **Ohm's Law**: The potential difference across a conductor is proportional to the current through it, provided the temperature and physical conditions are unchanged. $V = IR$.

### 3.2 Resistors in Series and Parallel
- **In Series**: $R_{total} = R_1 + R_2 + \\dots$
- **In Parallel**: $\\frac{1}{R_{total}} = \\frac{1}{R_1} + \\frac{1}{R_2} + \\dots$

### 3.3 Kirchhoff's Laws
- **First Law (Junction Rule)**: The sum of currents entering a junction equals the sum of currents leaving it. (Conservation of charge).
- **Second Law (Loop Rule)**: The sum of the potential differences around any closed loop is zero. (Conservation of energy).
                        `
                    },
                     {
                        id: 4,
                        title: 'Magnetism',
                        content: `
### 4.1 Magnetic Field
- A region of space where a moving charge or magnetic material experiences a magnetic force.
- Magnetic field lines emerge from North poles and enter South poles.

### 4.2 Magnetic Force
- **On a moving charge**: $F = qvB \\sin(\\theta)$. Use Right-Hand Rule to find direction.
- **On a current-carrying wire**: $F = ILB \\sin(\\theta)$.

### 4.3 Magnetic Field of a Current
- A current produces a magnetic field.
- **Long straight wire**: $B = \\frac{\\mu_0 I}{2\\pi r}$
- **Center of a circular coil**: $B = \\frac{\\mu_0 N I}{2r}$
- **Solenoid**: $B = \\mu_0 n I$
                        `
                    },
                    {
                        id: 5,
                        title: 'Electromagnetic Induction',
                        content: `
### 5.1 Magnetic Flux
- A measure of the total number of magnetic field lines passing through a given area. $\\Phi = BA \\cos(\\theta)$.

### 5.2 Faraday's Law of Induction
- The magnitude of the induced electromotive force (e.m.f.) in a coil is proportional to the rate of change of magnetic flux through the coil.
- Formula: $\\epsilon = -N \\frac{d\\Phi}{dt}$.

### 5.3 Lenz's Law
- The direction of the induced current is such that it opposes the change in magnetic flux that produced it.
                        `
                    },
                     {
                        id: 6,
                        title: 'Geometrical Optics',
                        content: `
### 6.1 Reflection and Refraction
- **Law of Reflection**: Angle of incidence = Angle of reflection.
- **Snell's Law of Refraction**: $n_1 \\sin(\\theta_1) = n_2 \\sin(\\theta_2)$, where $n$ is the refractive index.

### 6.2 Lenses
- **Thin Lens Equation**: $\\frac{1}{f} = \\frac{1}{u} + \\frac{1}{v}$
- **Magnification ($m$)**: $m = -\\frac{v}{u} = \\frac{h'}{h}$
- **Lensmaker's Formula**: $\\frac{1}{f} = (n-1)\\left(\\frac{1}{R_1} - \\frac{1}{R_2}\\right)$
                        `
                    },
                    {
                        id: 7,
                        title: 'Physical Optics',
                        content: `
### 7.1 Interference
- **Young's Double Slit Experiment**:
  - Bright fringes (constructive): $d \\sin(\\theta) = m\\lambda$
  - Dark fringes (destructive): $d \\sin(\\theta) = (m + \\frac{1}{2})\\lambda$

### 7.2 Diffraction
- **Single Slit Diffraction**:
  - Dark fringes: $a \\sin(\\theta) = m\\lambda$, where $a$ is the slit width.
                        `
                    },
                    {
                        id: 8,
                        title: 'Modern Physics',
                        content: `
### 8.1 Quantum Physics
- **Photoelectric Effect**: The emission of electrons when light shines on a material.
- **Einstein's Photoelectric Equation**: $hf = K_{max} + W$, where $hf$ is photon energy, $K_{max}$ is max kinetic energy of electron, and $W$ is work function.
- **de Broglie Wavelength**: $\\lambda = \\frac{h}{p}$.

### 8.2 Bohr's Model of the Atom
- Electrons orbit the nucleus in discrete, quantized energy levels.
- Electrons can transition between levels by absorbing or emitting photons of specific energies.
                        `
                    },
                    {
                        id: 9,
                        title: 'Nuclear Physics',
                        content: `
### 9.1 The Nucleus
- Composed of protons and neutrons (nucleons).
- **Atomic Number ($Z$)**: Number of protons.
- **Mass Number ($A$)**: Number of protons + neutrons.

### 9.2 Radioactivity
- The spontaneous decay of unstable nuclei.
- **$\\alpha$-decay**: Emission of a helium nucleus.
- **$\\beta$-decay**: Emission of an electron or positron.
- **$\\gamma$-decay**: Emission of a high-energy photon.

### 9.3 Nuclear Energy
- **Binding Energy**: The energy required to separate a nucleus into its constituent nucleons.
- **Fission**: Splitting a heavy nucleus into lighter ones.
- **Fusion**: Combining light nuclei into a heavier one.
                        `
                    }
                ]
            }
        ]
    }
];
