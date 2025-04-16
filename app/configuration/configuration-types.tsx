export interface ConfigData {
    configure: ConfigItem
    verification_code: string
    manufacturer: string
    model_name: string
    dealership: string
    customer: CustomerData
    previous_configurations: string[]
}

export interface ConfigItem {
    exterior: ConfigurationEntity[]
    interior: ConfigurationEntity[]
}

export interface ConfigurationEntity {
    name: string
    section_options: ConfigurationSectionOptions[]
}

export interface ConfigurationSectionOptions {
    section_name?: string
    options: ConfigurationOptions[]
}

export interface ConfigurationOptions {
    label: string
    preview_image: string
    isSelected?: boolean
    isDefault?: boolean
}

export interface CustomerData {
    first_name: string
    last_name: string
    email: string
    phone: string
}