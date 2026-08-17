<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
<footer class="site-footer">
	<div class="footer-inner">
		<div class="footer-col">
			<p class="footer-brand"><?php bloginfo( 'name' ); ?></p>
			<?php if ( is_active_sidebar( 'footer-1' ) ) : ?>
				<?php dynamic_sidebar( 'footer-1' ); ?>
			<?php endif; ?>
		</div>

		<nav class="footer-nav" aria-label="<?php esc_attr_e( 'Footermenu', 'wijnhuysdrie' ); ?>">
			<?php
			wp_nav_menu(
				array(
					'theme_location' => 'footer',
					'container'      => false,
					'fallback_cb'    => false,
				)
			);
			?>
		</nav>
	</div>
</footer>

<?php wp_footer(); ?>
</body>
</html>
