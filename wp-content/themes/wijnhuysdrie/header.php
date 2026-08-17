<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?><!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1">
<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<header class="site-header">
	<div class="bar">
		<a class="brand" href="<?php echo esc_url( home_url( '/' ) ); ?>">
			<?php bloginfo( 'name' ); ?>
		</a>

		<nav class="primary-nav" aria-label="<?php esc_attr_e( 'Hoofdmenu', 'wijnhuysdrie' ); ?>">
			<?php
			wp_nav_menu(
				array(
					'theme_location' => 'primary',
					'container'      => false,
					'fallback_cb'    => false,
				)
			);
			?>
		</nav>

		<div class="header-actions">
			<?php if ( class_exists( 'WooCommerce' ) ) : ?>
				<a class="cart-link" href="<?php echo esc_url( wc_get_cart_url() ); ?>">
					<?php esc_html_e( 'Winkelwagen', 'wijnhuysdrie' ); ?>
					(<?php echo esc_html( WC()->cart ? WC()->cart->get_cart_contents_count() : 0 ); ?>)
				</a>
			<?php endif; ?>
		</div>
	</div>
</header>
