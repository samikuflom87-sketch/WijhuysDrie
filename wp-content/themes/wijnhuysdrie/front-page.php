<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
get_header();
?>
<main id="main" class="site-main">

	<section class="hero">
		<div class="hero-inner">
			<p class="eyebrow"><?php esc_html_e( 'Wijnhandel', 'wijnhuysdrie' ); ?></p>
			<h1><?php bloginfo( 'name' ); ?></h1>
			<p class="lede">
				<?php
				esc_html_e(
					'Zorgvuldig geselecteerde wijnen, thuisbezorgd of af te halen. Vul hier de echte openingszin van de klant in.',
					'wijnhuysdrie'
				);
				?>
			</p>
			<?php if ( class_exists( 'WooCommerce' ) ) : ?>
				<a class="btn" href="<?php echo esc_url( get_permalink( wc_get_page_id( 'shop' ) ) ); ?>">
					<?php esc_html_e( 'Bekijk het assortiment', 'wijnhuysdrie' ); ?>
				</a>
			<?php endif; ?>
		</div>
	</section>

	<section class="featured">
		<h2><?php esc_html_e( 'Uitgelicht', 'wijnhuysdrie' ); ?></h2>
		<?php if ( class_exists( 'WooCommerce' ) ) : ?>
			<?php echo do_shortcode( '[products limit="3" columns="3"]' ); ?>
		<?php else : ?>
			<p class="notice">
				<?php esc_html_e( 'WooCommerce is nog niet actief. Activeer de plugin om hier producten te tonen.', 'wijnhuysdrie' ); ?>
			</p>
		<?php endif; ?>
	</section>

</main>
<?php
get_footer();
