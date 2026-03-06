import random
from app.models.orthotic_models import OrthoticSpec, ArchProfile, HeelCup, MetatarsalPad


# Material properties
MATERIAL_PROPERTIES = {
    "EVA_FOAM": {"density": "low", "shore_hardness": 35},
    "MEMORY_FOAM": {"density": "medium", "shore_hardness": 25},
    "CARBON_FIBER": {"density": "high", "shore_hardness": 80},
    "PREMIUM": {"density": "medium-high", "shore_hardness": 55},
}

# Arch height multipliers
ARCH_MULTIPLIERS = {
    "LOW": 0.7,
    "MEDIUM": 1.0,
    "HIGH": 1.3,
}

# Shoe type thickness adjustments
SHOE_THICKNESS = {
    "HEEL": 2.5,
    "SNEAKER": 4.0,
    "BOOT": 4.5,
    "LOAFER": 2.0,
    "SANDAL": 3.0,
    "SPORT": 5.0,
}


def generate_orthotic(
    measurements: dict | None,
    gait_data: dict | None,
    shoe_type: str,
    use_case: str,
    material: str,
    arch_height_pref: str,
) -> OrthoticSpec:
    """Generate orthotic design parameters based on scan data and preferences."""

    # Extract base measurements or use defaults
    foot_length = 265.0
    foot_width = 97.0
    arch_height = 25.0

    if measurements:
        # Use left foot measurements as primary, or right if left unavailable
        foot_data = measurements.get("left") or measurements.get("right")
        if foot_data:
            if isinstance(foot_data, dict):
                foot_length = foot_data.get("length_mm", foot_length)
                foot_width = foot_data.get("width_mm", foot_width)
                arch_height = foot_data.get("arch_height_mm", arch_height)

    # Apply arch preference multiplier
    arch_mult = ARCH_MULTIPLIERS.get(arch_height_pref, 1.0)
    adjusted_arch = arch_height * arch_mult

    # Material properties
    mat_props = MATERIAL_PROPERTIES.get(material, MATERIAL_PROPERTIES["EVA_FOAM"])

    # Base thickness from shoe type
    base_thickness = SHOE_THICKNESS.get(shoe_type, 4.0)

    # Sport use case gets thicker
    if use_case == "SPORT":
        base_thickness *= 1.2
    elif use_case == "MEDICAL":
        base_thickness *= 1.3

    # Arch profile
    arch_profile = ArchProfile(
        height_mm=round(adjusted_arch, 1),
        length_mm=round(foot_length * 0.35, 1),
        curvature="moderate" if arch_height_pref == "MEDIUM" else ("flat" if arch_height_pref == "LOW" else "pronounced"),
    )

    # Heel cup
    heel_cup = HeelCup(
        depth_mm=round(random.uniform(18, 28), 1),
        width_mm=round(foot_width * 0.6, 1),
    )

    # Metatarsal pad
    metatarsal_pad = MetatarsalPad(
        position_mm=round(foot_length * 0.55, 1),
        height_mm=round(random.uniform(4, 8), 1),
        width_mm=round(foot_width * 0.4, 1),
    )

    return OrthoticSpec(
        arch_profile=arch_profile,
        heel_cup=heel_cup,
        metatarsal_pad=metatarsal_pad,
        thickness_mm=round(base_thickness, 1),
        density=mat_props["density"],
        shore_hardness=mat_props["shore_hardness"],
        total_length_mm=round(foot_length * 0.85, 1),
        total_width_mm=round(foot_width * 0.9, 1),
    )
