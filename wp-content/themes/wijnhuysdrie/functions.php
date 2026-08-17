<?php
/**
 * Wijnhuys Drie theme functions.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'WIJNHUYSDRIE_VERSION', '0.1.0' );

function wijnhuysdrie_setup() {
	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support(
		'html5',
		array( 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script' )
	);

	add_theme_support( 'woocommerce' );
	add_theme_support( 'wc-product-gallery-zoom' );
	add_theme_support( 'wc-product-gallery-lightbox' );
	add_theme_support( 'wc-product-gallery-slider' );

	register_nav_menus(
		array(
			'primary' => __( 'Hoofdmenu', 'wijnhuysdrie' ),
			'footer'  => __( 'Footermenu', 'wijnhuysdrie' ),
		)
	);
}
add_action( 'after_setup_theme', 'wijnhuysdrie_setup' );

function wijnhuysdrie_assets() {
	wp_enqueue_style(
		'wijnhuysdrie-fonts',
		'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Public+Sans:wght@400;500;600;700&display=swap',
		array(),
		null
	);
	wp_enqueue_style( 'wijnhuysdrie-style', get_stylesheet_uri(), array(), WIJNHUYSDRIE_VERSION );
}
add_action( 'wp_enqueue_scripts', 'wijnhuysdrie_assets' );

function wijnhuysdrie_widgets_init() {
	register_sidebar(
		array(
			'name'          => __( 'Footer', 'wijnhuysdrie' ),
			'id'            => 'footer-1',
			'before_widget' => '<div class="footer-widget">',
			'after_widget'  => '</div>',
			'before_title'  => '<h3 class="footer-widget-title">',
			'after_title'   => '</h3>',
		)
	);
}
add_action( 'widgets_init', 'wijnhuysdrie_widgets_init' );

/**
 * WooCommerce rendert zijn eigen wrapper-hooks; we vervangen ze door onze
 * eigen main/content-boundary zodat de shop-pagina's binnen ditzelfde thema
 * passen in plaats van in WooCommerce's kale standaardopmaak.
 */
remove_action( 'woocommerce_before_main_content', 'woocommerce_output_content_wrapper', 10 );
remove_action( 'woocommerce_after_main_content', 'woocommerce_output_content_wrapper_end', 10 );
add_action( 'woocommerce_before_main_content', 'wijnhuysdrie_wc_wrapper_start', 10 );
add_action( 'woocommerce_after_main_content', 'wijnhuysdrie_wc_wrapper_end', 10 );

function wijnhuysdrie_wc_wrapper_start() {
	echo '<main id="main" class="site-main wc-main"><div class="content-boundary">';
}

function wijnhuysdrie_wc_wrapper_end() {
	echo '</div></main>';
}
