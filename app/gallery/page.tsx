"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, X } from "lucide-react"
import styles from "./gallery.module.css"
import { galleryImages } from "./galleryImages"
import BackHome from "../components/HeaderBackButtonTitle"
import HeaderBackButtonTitle from "../components/HeaderBackButtonTitle"

export default function Gallery() {
    const [selectedImage, setSelectedImage] = useState<number | null>(null)

    const closeModal = () => {
        setSelectedImage(null)
    }

    const handleModalImageClick = (e: React.MouseEvent) => {
        e.stopPropagation()
    }

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <HeaderBackButtonTitle title="Gallery" />

                <div className={styles.galleryGrid}>
                    {galleryImages.map((image, index) => (
                        <div key={index} className={styles.galleryItem}>
                            <div
                                className={styles.imageContainer}
                                onClick={() => setSelectedImage(index)}
                                role="button"
                                tabIndex={0}
                                aria-label={`View ${image.alt} in full size`}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        setSelectedImage(index)
                                        e.preventDefault()
                                    }
                                }}
                            >
                                <Image
                                    src={image.src || "/placeholder.svg"}
                                    alt={image.alt}
                                    fill
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                                    className={styles.image}
                                />
                                <div className={styles.viewFullSize}>
                                    <span>Click to view full size</span>
                                </div>
                            </div>
                            <div
                                className={styles.imageInfo}
                                onClick={() => setSelectedImage(index)}
                                role="button"
                                tabIndex={0}
                                aria-label={`View ${image.alt} in full size`}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        setSelectedImage(index)
                                        e.preventDefault()
                                    }
                                }}
                            >
                                <p className={styles.imageDescription}>{image.description}</p>
                                <p className={styles.imageCredit}>{image.credit}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <footer className={styles.footer}>
                <p className={styles.footerText}>© {new Date().getFullYear()} Chimera Inc. All rights reserved.</p>
            </footer>

            {/* Full-size image modal */}
            {selectedImage !== null && (
                <div className={styles.modal} onClick={closeModal}>
                    <button className={styles.closeButton} onClick={closeModal} aria-label="Close full-size image">
                        <X />
                    </button>
                    <div className={styles.modalContent} onClick={handleModalImageClick}>
                        <Image
                            src={galleryImages[selectedImage].src || "/placeholder.svg"}
                            alt={galleryImages[selectedImage].alt}
                            fill
                            sizes="100vw"
                            className={styles.modalImage}
                            priority
                        />
                        <div className={styles.modalInfo}>
                            <p className={styles.modalDescription}>{galleryImages[selectedImage].description}</p>
                            <p className={styles.modalCredit}>{galleryImages[selectedImage].credit}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

